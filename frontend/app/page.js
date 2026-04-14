"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ShapeGrid from "@/components/ShapeGrid";

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="2" width="8" height="8" rx="2" stroke="#10b981" strokeWidth="1.5"/>
        <rect x="12" y="2" width="8" height="8" rx="2" stroke="#10b981" strokeWidth="1.5"/>
        <rect x="2" y="12" width="8" height="8" rx="2" stroke="#10b981" strokeWidth="1.5"/>
        <circle cx="16" cy="16" r="4" fill="#10b981" opacity="0.2" stroke="#10b981" strokeWidth="1.5"/>
        <path d="M14.5 16L15.5 17L17.5 15" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    tag: "01 / SOURCING",
    title: "AI Candidate Matching",
    desc: "Parse resumes and rank candidates automatically. Zero noise, pure signal — the right fit surfaces instantly.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke="#10b981" strokeWidth="1.5"/>
        <path d="M11 7V11L14 13" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 11H3M19 11H16" stroke="#10b981" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    tag: "02 / SCHEDULING",
    title: "Automated Interviews",
    desc: "Sync calendars, send reminders, and conduct async video screens — no back-and-forth ever again.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 17L8 13L11 16L15 10L18 13" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2" y="4" width="18" height="14" rx="2" stroke="#10b981" strokeWidth="1.5"/>
      </svg>
    ),
    tag: "03 / ANALYTICS",
    title: "Hiring Intelligence",
    desc: "Real-time pipeline dashboards, time-to-hire metrics, and drop-off analysis in one command center.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M5 11L9 15L17 7" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 2C6 2 2 6 2 11C2 16 6 20 11 20C16 20 20 16 20 11" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    tag: "04 / ONBOARDING",
    title: "Day-One Ready",
    desc: "Automated offer letters, e-sign workflows, and onboarding checklists so new hires hit the ground running.",
  },
];

const steps = [
  { num: "01", title: "Post a role", desc: "Define the job in plain language. AI generates the JD, scorecard, and screening questions." },
  { num: "02", title: "AI screens applicants", desc: "Every resume is parsed, scored, and ranked against your criteria in seconds." },
  { num: "03", title: "Interview & decide", desc: "Structured interviews, async video, and collaborative scorecards — all in one place." },
  { num: "04", title: "Onboard seamlessly", desc: "Digital paperwork, equipment requests, and buddy assignments handled automatically." },
];

export default function Home() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #020c0a;
          color: #d1fae5;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
        }

        .mono { font-family: 'Space Mono', monospace; }

        /* Modified grid-bg to work with ShapeGrid */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent);
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up-1 { animation: fadeUp 0.7s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.45s ease both; }
        .fade-up-5 { animation: fadeUp 0.7s 0.6s ease both; }

        .feat-card {
          background: rgba(16,185,129,0.04);
          border: 1px solid rgba(52,211,153,0.12);
          border-radius: 12px;
          padding: 28px;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
          backdrop-filter: blur(4px);
        }
        .feat-card:hover {
          border-color: rgba(16,185,129,0.4);
          background: rgba(16,185,129,0.08);
          transform: translateY(-3px);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
          box-shadow: 0 0 32px rgba(16,185,129,0.35);
          transition: box-shadow 0.25s, transform 0.2s;
        }
        .btn-primary:hover {
          box-shadow: 0 0 48px rgba(16,185,129,0.55);
          transform: translateY(-2px);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(2, 12, 10, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(52,211,153,0.35);
          color: #6ee7b7;
          padding: 14px 28px;
          border-radius: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-ghost:hover {
          background: rgba(16,185,129,0.08);
          border-color: #10b981;
        }
      `}</style>

      {/* Background Layer */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <ShapeGrid 
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(16, 185, 129, 0.1)"
          hoverFillColor="rgba(16, 185, 129, 0.15)"
          squareSize={50}
          hoverTrailAmount={4}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />

        <main style={{ paddingTop: "64px" }}>
          
          {/* ─── HERO ─── */}
          <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
            <div className="grid-bg" />
            <div className="orb" style={{ width: 600, height: 600, background: "rgba(16,185,129,0.12)", top: -100, left: "50%", transform: "translateX(-50%)" }} />
            <div className="orb" style={{ width: 300, height: 300, background: "rgba(5,150,105,0.15)", top: 200, right: -80 }} />

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1, width: "100%" }}>
              <div className="fade-up-1" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "2rem" }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: "#10b981",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  padding: "5px 14px",
                  borderRadius: "999px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", display: "inline-block" }} />
                  AI-POWERED HIRING OS — V2.0
                </span>
              </div>

              <h1 className="fade-up-2" style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(42px, 7vw, 88px)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "#ecfdf5",
                marginBottom: "1.5rem",
                maxWidth: "800px",
              }}>
                Hire faster.<br />
                <span style={{ color: "#10b981" }}>Onboard smarter.</span>
              </h1>

              <p className="fade-up-3" style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "clamp(13px, 1.6vw, 16px)",
                color: "rgba(167,243,208,0.6)",
                lineHeight: 1.8,
                maxWidth: "520px",
                marginBottom: "2.5rem",
              }}>
                RecruitFlow automates every step — from sourcing and screening to offer letters and onboarding — so your team can focus on people, not process.
              </p>

              <div className="fade-up-4" style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={() => router.push("/auth")}>
                  START HIRING NOW
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7H12M8 3L12 7L8 11" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="btn-ghost">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="#6ee7b7" strokeWidth="1.2"/>
                    <path d="M5.5 5L9 7L5.5 9V5Z" fill="#6ee7b7"/>
                  </svg>
                  WATCH DEMO
                </button>
              </div>

              <div className="fade-up-5" style={{ display: "flex", gap: "32px", marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid rgba(52,211,153,0.1)", flexWrap: "wrap" }}>
                {[
                  { val: "4x", label: "faster time-to-hire" },
                  { val: "92%", label: "candidate match accuracy" },
                  { val: "10k+", label: "hires powered" },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "36px", color: "#10b981", letterSpacing: "-0.03em" }}>{val}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", color: "rgba(167,243,208,0.5)", marginTop: "4px", textTransform: "uppercase" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── FEATURES ─── */}
          <section style={{ padding: "120px 1.5rem", position: "relative" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", color: "#10b981" }}>// CAPABILITIES</span>
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#ecfdf5", letterSpacing: "-0.02em", marginBottom: "64px", maxWidth: "520px", lineHeight: 1.15 }}>
                Everything your talent team needs.
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
                {features.map((f) => (
                  <div key={f.tag} className="feat-card">
                    <div style={{ marginBottom: "16px" }}>{f.icon}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.14em", color: "rgba(16,185,129,0.6)", marginBottom: "10px" }}>{f.tag}</div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", color: "#ecfdf5", marginBottom: "10px" }}>{f.title}</h3>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", lineHeight: 1.8, color: "rgba(167,243,208,0.55)" }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── HOW IT WORKS ─── */}
          <section style={{ padding: "100px 1.5rem", background: "rgba(16,185,129,0.03)", borderTop: "1px solid rgba(52,211,153,0.08)", borderBottom: "1px solid rgba(52,211,153,0.08)" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", color: "#10b981" }}>HOW IT WORKS :</span>
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 4vw, 44px)", color: "#ecfdf5", letterSpacing: "-0.02em", marginBottom: "64px" }}>Four steps. Zero friction.</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px" }}>
                {steps.map((s, i) => (
                  <div key={s.num} style={{ position: "relative" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#10b981", marginBottom: "20px", fontWeight: 700 }}>{s.num}</div>
                    <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "17px", color: "#ecfdf5", marginBottom: "10px" }}>{s.title}</h4>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", lineHeight: 1.8, color: "rgba(167,243,208,0.5)" }}>{s.desc}</p>
                    {i < steps.length - 1 && (
                      <div style={{ position: "absolute", top: "20px", left: "48px", right: "-16px", height: "1px", background: "linear-gradient(90deg, rgba(16,185,129,0.3), transparent)" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── CTA BANNER ─── */}
          <section style={{ padding: "120px 1.5rem", position: "relative", overflow: "hidden" }}>
            <div className="orb" style={{ width: 500, height: 500, background: "rgba(16,185,129,0.1)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
            <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px, 5vw, 58px)", color: "#ecfdf5", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                Ready to modernize<br /><span style={{ color: "#10b981" }}>your hiring stack?</span>
              </h2>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", color: "rgba(167,243,208,0.55)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
                Join hundreds of companies already using RecruitFlow to build better teams, faster.
              </p>
              <button className="btn-primary" onClick={() => router.push("/auth")} style={{ fontSize: "14px", padding: "16px 40px" }}>
                GET STARTED FREE
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7H12M8 3L12 7L8 11" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </section>

          {/* ─── FOOTER ─── */}
          <footer style={{ borderTop: "1px solid rgba(52,211,153,0.1)", padding: "32px 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", maxWidth: "1200px", margin: "0 auto" }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "rgba(167,243,208,0.35)", letterSpacing: "0.06em" }}>
              © 2026 RECRUITFLOW — ALL SYSTEMS OPERATIONAL
            </span>
            <div style={{ display: "flex", gap: "24px" }}>
              {["Privacy", "Terms", "Status"].map(l => (
                <a key={l} href="#" style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "rgba(167,243,208,0.35)", textDecoration: "none", letterSpacing: "0.06em" }}>
                  {l.toUpperCase()}
                </a>
              ))}
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}