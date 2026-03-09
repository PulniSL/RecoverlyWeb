import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FiTrash2 } from "react-icons/fi";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useAuth } from "../auth/AuthContext";
import { api } from "../api/client";

const COLORS = ["#064E3B", "#10b981", "#3b82f6", "#8b5cf6", "#f97316", "#ef4444", "#facc15"];

type DistributionMap = Record<string, number>;

type NarrativeItem = {
  prediction_id: number;
  input_text: string;
  most_impactful?: string | null;
};

function getNarrativeMostImpactful(x: any): string | null {
  if (!x || typeof x !== "object") return null;

  if (typeof x.most_impactful === "string" && x.most_impactful.trim()) {
    return x.most_impactful.trim();
  }

  return null;
}

function normalizeItems(payload: any): NarrativeItem[] {
  if (!payload) return [];

  if (Array.isArray(payload?.items)) {
    return payload.items
      .filter((x: any) => x && typeof x === "object")
      .map((x: any) => ({
        prediction_id: Number(x.prediction_id),
        input_text: String(x.input_text ?? ""),
        most_impactful: getNarrativeMostImpactful(x),
      }))
      .filter((x: NarrativeItem) => Number.isFinite(x.prediction_id) && x.input_text.length > 0);
  }

  if (Array.isArray(payload?.narratives)) {
    return payload.narratives.map((t: any, idx: number) => ({
      prediction_id: -1 * (idx + 1),
      input_text: String(t ?? ""),
      most_impactful: null,
    }));
  }

  return [];
}

function normalizeDistribution(payload: any): DistributionMap {
  if (!payload) return {};
  if (payload?.distribution && typeof payload.distribution === "object") {
    return payload.distribution as DistributionMap;
  }
  if (typeof payload === "object" && !Array.isArray(payload)) {
    if ("narratives" in payload || "items" in payload) return {};
    return payload as DistributionMap;
  }
  return {};
}

function getLogoDataUri(): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="280" height="90" viewBox="0 0 280 90">
    <rect x="0" y="0" width="280" height="90" rx="16" fill="#064E3B"/>
    <circle cx="48" cy="45" r="22" fill="#10b981"/>
    <path d="M42 45c0-10 8-18 18-18" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M42 45c0 10 8 18 18 18" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/>
    <text x="86" y="54" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#ffffff">Recoverly</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function fitText(doc: jsPDF, text: string, maxWidth: number, startSize: number, minSize: number) {
  let size = startSize;
  doc.setFontSize(size);
  let lines = doc.splitTextToSize(text, maxWidth);

  while (size > minSize && lines.length > 2) {
    size -= 1;
    doc.setFontSize(size);
    lines = doc.splitTextToSize(text, maxWidth);
  }

  return { size, lines };
}

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const [items, setItems] = useState<NarrativeItem[]>([]);
  const [distribution, setDistribution] = useState<DistributionMap>({});
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function refreshNarratives() {
    setErrMsg(null);
    try {
      const res = await api.get("/all-patient-narratives");
      const list = normalizeItems(res.data);
      setItems([...list]);
    } catch (e: any) {
      setErrMsg(e?.response?.data?.detail || e?.message || "Failed to load narratives");
      setItems([]);
    }
  }

  async function runGroupAnalysis() {
    setLoading(true);
    setErrMsg(null);
    try {
      const res = await api.post("/group-analysis-from-db", {});
      setDistribution(normalizeDistribution(res.data));
    } catch (e: any) {
      setErrMsg(e?.response?.data?.detail || e?.message || "Group analysis failed");
      setDistribution({});
    } finally {
      setLoading(false);
    }
  }

  async function deleteNarrative(prediction_id: number) {
    if (prediction_id <= 0) {
      setErrMsg("IDs not available yet. Restart backend with updated /all-patient-narratives endpoint.");
      return;
    }

    const ok = window.confirm("Delete this narrative from the database?");
    if (!ok) return;

    setErrMsg(null);
    setDeletingId(prediction_id);
    try {
      await api.delete(`/narratives/${prediction_id}`);
      await refreshNarratives();
      await runGroupAnalysis();
    } catch (e: any) {
      setErrMsg(e?.response?.data?.detail || e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    refreshNarratives();
    runGroupAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pieData = useMemo(() => {
    const entries = Object.entries(distribution);
    if (entries.length === 0) return [];

    const total = entries.reduce((s, [, v]) => s + Number(v || 0), 0) || 1;

    return entries
      .map(([name, value]) => {
        const n = Number(value || 0);
        return { name, value: n, percentOfTotal: (n / total) * 100 };
      })
      .sort((a, b) => b.value - a.value);
  }, [distribution]);

  const topFactor = pieData[0];

  async function downloadReportPdf() {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 36;

    const headerH = 92;
    const footerH = 28;

    const now = new Date();
    const generated = now.toLocaleString();
    const patientCount = items.length;
    const uniqueFactors = Object.keys(distribution).length;

    const topName = topFactor?.name ?? "—";
    const topPct = topFactor ? `${topFactor.percentOfTotal.toFixed(0)}%` : "—";

    const barRows = pieData.map((d) => ({ factor: d.name, pct: d.percentOfTotal }));

    const drawHeader = () => {
      doc.setFillColor(6, 78, 59);
      doc.rect(0, 0, pageW, headerH, "F");

      const logo = getLogoDataUri();
      try {
        doc.addImage(logo, "SVG", margin, 18, 140, 45);
      } catch {
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("Recoverly", margin, 48);
      }

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Group Narrative Analysis Report", pageW / 2, 38, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Generated: ${generated}   |   Patients: ${patientCount}`, pageW / 2, 62, {
        align: "center",
      });
    };

    const drawFooter = (pageNumber: number, totalPages: number) => {
      const y = pageH - 14;
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Confidential – For Clinical Use Only", margin, y);
      doc.text(`Page ${pageNumber} / ${totalPages}`, pageW - margin, y, { align: "right" });
    };

    drawHeader();
    let cursorY = headerH + 18;

    const cardGap = 12;
    const cardW = (pageW - margin * 2 - cardGap * 2) / 3;
    const cardH = 74;

    function card(x: number, y: number, title: string, value: string, sub: string) {
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y, cardW, cardH, 10, 10, "FD");

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(title, x + 12, y + 20);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);

      const maxTextW = cardW - 24;
      const fitted = fitText(doc, value, maxTextW, 16, 10);
      doc.setFontSize(fitted.size);
      doc.text(fitted.lines, x + 12, y + 44);

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(sub, x + 12, y + 64);
    }

    const x1 = margin;
    const x2 = margin + cardW + cardGap;
    const x3 = margin + (cardW + cardGap) * 2;

    card(x1, cursorY, "TOTAL PATIENTS", String(patientCount), "Narratives stored");
    card(x2, cursorY, "TOP FACTOR", `${topName} (${topPct})`, "Most common highest-ranked");
    card(x3, cursorY, "UNIQUE FACTORS", String(uniqueFactors), "Detected in cohort");

    cursorY += cardH + 18;

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Factor Distribution", margin, cursorY);
    cursorY += 10;

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, cursorY, pageW - margin * 2, 170, 12, 12, "FD");

    const boxX = margin + 14;
    const boxY = cursorY + 18;
    const maxPct = Math.max(...barRows.map((r) => r.pct), 1);
    const barMaxW = pageW - margin * 2 - 210;

    let by = boxY;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    barRows.slice(0, 10).forEach((r, idx) => {
      const pct = r.pct;
      const bw = Math.max(8, (pct / maxPct) * barMaxW);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(r.factor, boxX, by);

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.text(`${pct.toFixed(0)}%`, boxX + barMaxW + 70, by);

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(boxX, by + 8, barMaxW, 10, 6, 6, "F");

      const hex = COLORS[idx % COLORS.length];
      const rgb = [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
      ];
      doc.setFillColor(rgb[0], rgb[1], rgb[2]);
      doc.roundedRect(boxX, by + 8, bw, 10, 6, 6, "F");

      by += 26;
    });

    cursorY += 170 + 18;

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Individual Patient Narratives (sample)", margin, cursorY);
    cursorY += 10;

    const sampleRows = items.slice(0, 12).map((it, i) => [
      `#${i + 1}`,
      it.input_text,
      it.most_impactful?.trim() || "",
    ]);

    autoTable(doc, {
      startY: cursorY,
      head: [["Patient", "Narrative", "Most Impactful Cause"]],
      body: sampleRows,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 9.5,
        cellPadding: 6,
        overflow: "linebreak",
        valign: "top",
        lineColor: [226, 232, 240],
        lineWidth: 0.6,
      },
      headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 330 }, 2: { cellWidth: 130 } },
      margin: { left: margin, right: margin, top: headerH + 14, bottom: footerH + 18 },
      pageBreak: "auto",
      rowPageBreak: "avoid",
      didDrawPage: () => drawHeader(),
    });

    const lastY = (doc as any).lastAutoTable?.finalY ?? cursorY + 40;
    let insightsY = lastY + 20;
    const safeBottom = pageH - footerH - 22;

    if (insightsY > safeBottom - 90) {
      doc.addPage();
      drawHeader();
      insightsY = headerH + 24;
    }

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Group Insights & Counsellor Recommendations", margin, insightsY);
    insightsY += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);

    const recText =
      `Based on the analyzed cohort, the strongest pattern is ${topName}. ` +
      `Suggested interventions may include structured group sessions focused on coping skills, ` +
      `targeted psychoeducation linked to this factor, and follow-up screening for co-occurring stressors. ` +
      `Use these insights as decision-support alongside clinical judgement.`;

    const recLines = doc.splitTextToSize(recText, pageW - margin * 2);
    doc.text(recLines, margin, insightsY);

    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      drawFooter(p, totalPages);
    }

    doc.save(`Recoverly_Group_Dashboard_Report_${Date.now()}.pdf`);
  }

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 22,
          boxShadow: "0 10px 30px rgba(2, 6, 23, 0.06)",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 46, color: "#0f172a" }}>Dashboard</h1>
            <p style={{ marginTop: 10, color: "#475569", lineHeight: 1.6 }}>
              Logged in as: {user?.full_name || user?.email} ({user?.role})
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={logout}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                background: "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {errMsg && (
          <div
            style={{
              marginTop: 12,
              background: "#fff7ed",
              border: "1px solid #fdba74",
              color: "#9a3412",
              padding: 12,
              borderRadius: 12,
              fontWeight: 600,
            }}
          >
            {errMsg}
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <div style={{ background: "white", borderRadius: 16, padding: 18, boxShadow: "0 10px 30px rgba(2, 6, 23, 0.06)" }}>
          <div style={{ color: "#64748b", fontWeight: 800, letterSpacing: 0.5 }}>NARRATIVES IN DB</div>
          <div style={{ fontSize: 40, fontWeight: 900, marginTop: 6, color: "#0f172a" }}>{items.length}</div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 18, boxShadow: "0 10px 30px rgba(2, 6, 23, 0.06)" }}>
          <div style={{ color: "#64748b", fontWeight: 800, letterSpacing: 0.5 }}>TOP FACTOR</div>
          <div style={{ marginTop: 8, fontSize: 20, fontWeight: 900, color: "#0f172a" }}>
            {topFactor ? `${topFactor.name} (${topFactor.percentOfTotal.toFixed(0)}%)` : "—"}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 18, boxShadow: "0 10px 30px rgba(2, 6, 23, 0.06)" }}>
          <div style={{ color: "#64748b", fontWeight: 800, letterSpacing: 0.5 }}>ACTIONS</div>

          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button
              onClick={refreshNarratives}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                background: "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Refresh Narratives
            </button>

            <button
              onClick={runGroupAnalysis}
              disabled={loading}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "none",
                background: "#064E3B",
                color: "white",
                fontWeight: 900,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Running..." : "Run Group Analysis"}
            </button>

            <button
              onClick={downloadReportPdf}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #064E3B",
                background: "white",
                color: "#064E3B",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Download Report (PDF)
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: 14,
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 18,
            boxShadow: "0 10px 30px rgba(2, 6, 23, 0.06)",
            minHeight: 420,
          }}
        >
          <h2 style={{ marginTop: 0, color: "#0f172a" }}>Stored Patient Narratives</h2>
          <p style={{ color: "#64748b", marginTop: 6 }}>Auto-loaded from DB.</p>

          <div style={{ maxHeight: 320, overflow: "auto", paddingRight: 8 }}>
            {items.length === 0 ? (
              <div style={{ color: "#64748b", fontWeight: 700 }}>No narratives found yet.</div>
            ) : (
              items.map((it, i) => (
                <div
                  key={it.prediction_id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 10,
                    background: "#fbfdff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <div style={{ color: "#64748b", fontWeight: 800 }}>Narrative #{i + 1}</div>

                    <button
                      onClick={() => deleteNarrative(it.prediction_id)}
                      disabled={deletingId === it.prediction_id}
                      title="Delete narrative"
                      aria-label="Delete narrative"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        border: "1px solid #fecaca",
                        background: "#fff1f2",
                        color: "#b91c1c",
                        cursor: deletingId === it.prediction_id ? "not-allowed" : "pointer",
                        opacity: deletingId === it.prediction_id ? 0.7 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff1f2")}
                    >
                      {deletingId === it.prediction_id ? "…" : <FiTrash2 size={16} />}
                    </button>
                  </div>

                  <div style={{ color: "#0f172a", lineHeight: 1.5, marginTop: 6 }}>{it.input_text}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 18,
            boxShadow: "0 10px 30px rgba(2, 6, 23, 0.06)",
            minHeight: 420,
          }}
        >
          <h2 style={{ marginTop: 0, color: "#0f172a" }}>Group Distribution</h2>
          <p style={{ color: "#64748b", marginTop: 6 }}>Most common highest-ranked factor across the analyzed group.</p>

          <div style={{ width: "100%", height: 340 }}>
            {pieData.length === 0 ? (
              <div style={{ color: "#64748b", fontWeight: 700 }}>No group distribution yet. Click “Run Group Analysis”.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="80%"
                    labelLine={false}
                    label={({ percent }: any) => `${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}