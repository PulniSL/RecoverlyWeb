// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("counsellor@recoverly.lk");
  const [password, setPassword] = useState("Pulni123");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      setLoading(true);
      await login(email, password);
      nav("/intake", { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.detail || e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.topbar}>
        <div style={styles.brand}>
          <div style={styles.logoCircle}>
            <span style={styles.leaf}>🍃</span>
          </div>
          <div>
            <div style={styles.brandName}>Recoverly</div>
            <div style={styles.brandTag}>Counselor Portal</div>
          </div>
        </div>

        <div style={styles.topbarRight}>
          <span style={styles.secureDot} />
          <span style={styles.secureText}>Secure access</span>
        </div>
      </header>

      {/* 2-column shell */}
      <main className="login-shell" style={styles.shell}>
        {/* Left panel */}
        <section style={styles.left}>
          <div style={styles.leftInner}>
            <div style={styles.leftBadge}>
              <div style={styles.leftLogo}>🍃</div>
              <div>
                <div style={styles.leftBadgeTitle}>Recoverly</div>
                <div style={styles.leftBadgeSub}>Clinical Admin</div>
              </div>
            </div>

            <h2 style={styles.leftTitle}>Clinical Portal</h2>
            <p style={styles.leftText}>
              Secure counselor access for narrative intake, risk insights, and patient monitoring.
            </p>

            <div style={styles.bullets}>
              <div style={styles.bullet}>✔ Role-based access</div>
              <div style={styles.bullet}>✔ Audit-friendly workflow</div>
              <div style={styles.bullet}>✔ Privacy-first storage</div>
            </div>

            <div style={styles.leftHint}>
              Tip: No public signup. Accounts are created by an admin.
            </div>
          </div>
        </section>

        {/* Right panel */}
        <section style={styles.right}>
          <div style={styles.card}>
            {loading && <div style={styles.loadingBar} />}

            <div style={styles.cardHeader}>
              <h1 style={styles.h1}>Sign in</h1>
              <p style={styles.p}>Use your counselor account to continue.</p>
            </div>

            {err && <div style={styles.error}>{err}</div>}

            <form onSubmit={onSubmit} style={styles.form}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrap}>
                <span style={styles.icon}>@</span>
                <input
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="counsellor@recoverly.lk"
                  type="email"
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>

              <label style={{ ...styles.label, marginTop: 14 }}>Password</label>
              <div style={styles.inputWrap}>
                <span style={styles.icon}>🔒</span>
                <input
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  style={styles.eyeBtn}
                  disabled={loading}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>

              <div style={styles.row}>
                <button
                  type="button"
                  style={styles.linkBtn}
                  onClick={() => nav("/forgot-password")}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading} style={styles.submit}>
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div style={styles.note}>
                No public signup. Ask an admin to create your counselor account.
              </div>
            </form>

            <footer style={styles.footer}>
              © {new Date().getFullYear()} Recoverly • Secure access to clinical tools
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f4fbf7 0%, #ffffff 55%)",
    color: "#0f172a",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
  },

  topbar: {
    height: 74,
    background: "#064E3B",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 22px",
    boxShadow: "0 6px 20px rgba(2, 6, 23, 0.18)",
  },
  brand: { display: "flex", gap: 12, alignItems: "center" },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    background: "rgba(255,255,255,0.14)",
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(255,255,255,0.25)",
  },
  leaf: { fontSize: 18, lineHeight: 1 },
  brandName: { fontWeight: 800, letterSpacing: 0.2, fontSize: 18 },
  brandTag: { opacity: 0.85, fontSize: 12, marginTop: 2 },
  topbarRight: { display: "flex", alignItems: "center", gap: 10, opacity: 0.9 },
  secureDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "#34d399",
    boxShadow: "0 0 0 4px rgba(52, 211, 153, 0.16)",
  },
  secureText: { fontSize: 12 },

  shell: {
    minHeight: "calc(100vh - 74px)",
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
  },

  left: {
    padding: "42px 28px",
    background:
      "linear-gradient(180deg, rgba(6,78,59,0.12) 0%, rgba(16,185,129,0.05) 100%)",
    borderRight: "1px solid rgba(15,23,42,0.06)",
  },
  leftInner: { maxWidth: 560, margin: "0 auto" },

  leftBadge: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  leftLogo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "#064E3B",
    color: "white",
    display: "grid",
    placeItems: "center",
    fontSize: 22,
    boxShadow: "0 14px 40px rgba(2,6,23,0.18)",
  },
  leftBadgeTitle: { fontWeight: 900, fontSize: 16, color: "#052e25" },
  leftBadgeSub: { fontSize: 12, color: "#334155", marginTop: 2 },

  leftTitle: { margin: "18px 0 8px", fontSize: 30, fontWeight: 900, color: "#052e25" },
  leftText: { margin: 0, color: "#334155", lineHeight: 1.7, fontSize: 14 },

  bullets: { marginTop: 18, display: "grid", gap: 10 },
  bullet: {
    background: "rgba(255,255,255,0.75)",
    border: "1px solid rgba(15,23,42,0.06)",
    borderRadius: 14,
    padding: "10px 12px",
    color: "#0f172a",
    fontWeight: 700,
    fontSize: 13,
  },

  leftHint: {
    marginTop: 18,
    fontSize: 12,
    color: "#64748b",
    background: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(15,23,42,0.06)",
    borderRadius: 14,
    padding: "10px 12px",
  },

  right: {
    display: "grid",
    placeItems: "center",
    padding: "28px 16px",
  },

  card: {
    width: "min(480px, 92vw)",
    background: "white",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 18px 60px rgba(2, 6, 23, 0.10)",
    border: "1px solid rgba(15, 23, 42, 0.06)",
  },

  loadingBar: {
    height: 3,
    borderRadius: 999,
    background: "linear-gradient(90deg, #34d399 0%, #10b981 50%, #34d399 100%)",
    marginBottom: 12,
  },

  cardHeader: { marginBottom: 14 },
  h1: { fontSize: 24, margin: 0, fontWeight: 900 },
  p: { margin: "6px 0 0", color: "#475569", fontSize: 13 },

  error: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#9f1239",
    padding: "10px 12px",
    borderRadius: 12,
    fontSize: 13,
    margin: "10px 0 0",
  },

  form: { marginTop: 14 },
  label: { fontSize: 12, fontWeight: 800, color: "#0f172a" },

  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid rgba(15, 23, 42, 0.10)",
    borderRadius: 14,
    padding: "10px 12px",
    marginTop: 8,
    background: "#f8fafc",
  },
  icon: { width: 22, textAlign: "center", opacity: 0.7 },
  input: {
    border: "none",
    outline: "none",
    background: "transparent",
    flex: 1,
    fontSize: 14,
    color: "#0f172a",
  },

  eyeBtn: {
    border: "none",
    background: "transparent",
    color: "#065f46",
    fontWeight: 800,
    fontSize: 12,
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: 10,
  },

  row: { display: "flex", justifyContent: "flex-end", marginTop: 10 },

  linkBtn: {
    border: "none",
    background: "transparent",
    color: "#059669",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 13,
    padding: 0,
    opacity: 0.95,
  },

  submit: {
    width: "100%",
    marginTop: 14,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(6, 95, 70, 0.25)",
    background: "linear-gradient(180deg, #34d399 0%, #10b981 100%)",
    color: "#052e25",
    fontWeight: 900,
    letterSpacing: 0.2,
    fontSize: 14,
    cursor: "pointer",
  },

  note: {
    marginTop: 12,
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },

  footer: {
    marginTop: 16,
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
};