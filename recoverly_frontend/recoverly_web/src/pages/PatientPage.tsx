import { useMemo, useState } from "react";
import SpeechToText from "../components/SpeechToText";
import { predict } from "../api/predict";

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function validateNarrative(rawText: string): string | null {
  const text = normalizeText(rawText);
  const lower = text.toLowerCase();

  if (!text) {
    return "Please enter a narrative before analysis.";
  }

  const blockedExact = new Set([
    "hi",
    "hello",
    "hello world",
    "test",
    "testing",
    "ok",
    "okay",
    "thanks",
    "thank you",
    "good morning",
    "good evening",
    "hey",
  ]);

  if (blockedExact.has(lower)) {
    return "No causal factors detected. Please enter a meaningful addiction-related narrative with enough relevant detail for analysis.";
  }

  const wordCount = text.split(" ").filter(Boolean).length;

  if (wordCount < 6) {
    return "Narrative is too short. Please enter a more detailed addiction-related narrative for analysis.";
  }

  const alphaCount = (text.match(/[a-zA-Z]/g) || []).length;
  if (alphaCount < 12) {
    return "No causal factors detected. Please enter a meaningful addiction-related narrative with enough relevant detail for analysis.";
  }

  const uniqueWords = new Set(
    lower
      .split(/[^a-zA-Z]+/)
      .map((w) => w.trim())
      .filter(Boolean)
  );

  if (uniqueWords.size < 4) {
    return "Narrative is not detailed enough for reliable analysis. Please describe the situation in more detail.";
  }

  const lowValuePatterns = [
    /^[a-z\s]+$/,
    /^(hi|hello|hey|ok|okay|test|testing)(\s+(hi|hello|hey|ok|okay|test|testing))*$/i,
  ];

  if (
    wordCount <= 8 &&
    lowValuePatterns.some((pattern) => pattern.test(lower))
  ) {
    return "No causal factors detected. Please enter a meaningful addiction-related narrative with enough relevant detail for analysis.";
  }

  return null;
}

export default function PatientPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canAnalyze = useMemo(
    () => consent && text.trim().length > 0 && !loading,
    [consent, text, loading]
  );

  async function analyze() {
    setErr(null);

    const cleanedText = normalizeText(text);
    const validationError = validateNarrative(cleanedText);

    if (validationError) {
      setResult(null);
      setErr(validationError);
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await predict(cleanedText, "web_user");
      setResult(res);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || e?.message || "Predict failed");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setText("");
    setResult(null);
    setErr(null);
  }

  const topColors = ["#ef4444", "#facc15", "#22c55e"];

  const hasTop3 = Array.isArray(result?.top3) && result.top3.length > 0;
  const mostImpactful =
    typeof result?.most_impactful === "string" && result.most_impactful.trim()
      ? result.most_impactful
      : "Not available";

  return (
    <div className="container">
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <h1 className="h1" style={{ marginBottom: 8 }}>
          Narrative Intake
        </h1>
        <p className="sub">
          Decision-support insights for counselors/clinicians (not a diagnosis).
        </p>
      </div>

      {err && (
        <div
          className="card card-pad"
          style={{
            border: "1px solid #ef4444",
            background: "#fff1f2",
            marginBottom: 14,
          }}
        >
          <b style={{ color: "#991b1b" }}>{err}</b>
        </div>
      )}

      <div className="grid">
        <div className="card card-pad" style={{ gridColumn: "span 6" }}>
          <h2 style={{ margin: "0 0 10px 0" }}>Consent & Anonymity</h2>

          <div
            style={{
              background: "#fbfdff",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 14,
              lineHeight: 1.7,
              color: "#334155",
            }}
          >
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>
                <b>Do not include</b> names/addresses/contact details.
              </li>
              <li>
                Submit <b>anonymously</b>.
              </li>
              <li>
                Participation is <b>voluntary</b>.
              </li>
              <li>Outputs support clinical judgement, not replace it.</li>
            </ul>
          </div>

          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginTop: 14,
              fontWeight: 700,
            }}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={() => setConsent((v) => !v)}
            />
            I understand and I agree to submit anonymously.
          </label>
        </div>

        <div className="card card-pad" style={{ gridColumn: "span 6" }}>
          <h2 style={{ margin: "0 0 10px 0" }}>Narrative Input</h2>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <SpeechToText disabled={!consent} onText={setText} />
            <span style={{ fontSize: 13, color: "var(--muted)" }}>
              {consent
                ? "Tap Speak and talk in English. Text will appear below."
                : "Enable consent first to use mic."}
            </span>
          </div>

          <textarea
            className="textarea"
            disabled={!consent}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              consent
                ? "Describe contributing factors, triggers, emotions, relationships, or substance-use experiences..."
                : "Tick consent to enable input."
            }
          />

          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              color: "var(--muted)",
              lineHeight: 1.5,
            }}
          >
            Enter a meaningful addiction-related narrative. Very short greetings or unrelated text will not be analyzed.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              disabled={!canAnalyze}
              onClick={analyze}
            >
              {loading ? "Analyzing..." : "Analyze + Save"}
            </button>
            <button className="btn" onClick={clearAll} disabled={loading}>
              Clear
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <h3 style={{ margin: "0 0 8px 0" }}>Individual Summary</h3>
            <p className="sub" style={{ marginBottom: 12 }}>
              Most impactful factor + Top-3 score bars.
            </p>

            {!result ? (
              <div
                style={{
                  border: "1px dashed var(--border)",
                  borderRadius: 14,
                  padding: 14,
                  color: "var(--muted)",
                }}
              >
                No result yet. Submit a narrative to view insights.
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: 14,
                  background: "#fbfdff",
                }}
              >
                <div style={{ fontWeight: 900, marginBottom: 12 }}>
                  Most impactful: <span className="badge">{mostImpactful}</span>
                </div>

                {!hasTop3 ? (
                  <div style={{ color: "var(--muted)", fontWeight: 700 }}>
                    No ranked factors returned for this narrative.
                  </div>
                ) : (
                  result.top3.map((item: any, i: number) => {
                    const pct = Math.max(0, Math.min(100, Math.round((item.score ?? 0) * 100)));
                    return (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 10,
                          }}
                        >
                          <div style={{ fontWeight: 800 }}>
                            {item.label || "Unknown factor"}
                          </div>
                          <div style={{ color: "var(--muted)", fontWeight: 800 }}>
                            {pct}
                          </div>
                        </div>

                        <div className="barWrap" style={{ marginTop: 6 }}>
                          <div
                            className="bar"
                            style={{
                              width: `${pct}%`,
                              background: topColors[i] || "#22c55e",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}