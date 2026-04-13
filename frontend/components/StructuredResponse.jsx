export default function StructuredResponse({ data }) {
  if (!data) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontFamily: "'Space Mono', monospace", fontSize: "13px" }}>

      {/* Name + Company */}
      {(data.name || data.current_company) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {data.name && (
            <p style={{ margin: 0, color: "#ecfdf5", fontSize: "15px", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
              {data.name}
            </p>
          )}
          {data.current_company && (
            <p style={{ margin: 0, color: "rgba(167,243,208,0.5)", fontSize: "12px" }}>
              {data.current_company}
            </p>
          )}
        </div>
      )}

      {/* Divider */}
      {(data.name || data.current_company) && (
        <div style={{ height: "1px", background: "rgba(52,211,153,0.12)" }} />
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: "10px", letterSpacing: "0.12em", color: "rgba(167,243,208,0.4)" }}>
            SKILLS
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {data.skills.map((skill, i) => (
              <span key={i} style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.25)",
                color: "#6ee7b7",
                padding: "3px 10px",
                borderRadius: "999px",
                fontSize: "11px",
                letterSpacing: "0.04em",
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience_summary && (
        <div>
          <p style={{ margin: "0 0 5px", fontSize: "10px", letterSpacing: "0.12em", color: "rgba(167,243,208,0.4)" }}>
            EXPERIENCE
          </p>
          <p style={{ margin: 0, color: "rgba(209,250,229,0.75)", lineHeight: 1.7 }}>
            {data.experience_summary}
          </p>
        </div>
      )}

      {/* Highlights */}
      {data.notable_information && (
        <div>
          <p style={{ margin: "0 0 5px", fontSize: "10px", letterSpacing: "0.12em", color: "rgba(167,243,208,0.4)" }}>
            HIGHLIGHTS
          </p>
          <p style={{ margin: 0, color: "rgba(209,250,229,0.75)", lineHeight: 1.7 }}>
            {data.notable_information}
          </p>
        </div>
      )}

      {/* Sources */}
      {data.sources?.length > 0 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: "10px", letterSpacing: "0.12em", color: "rgba(167,243,208,0.4)" }}>
            SOURCES
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {data.sources.map((link, i) => (
              <a key={i} href={link} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: "7px",
                color: "#10b981",
                textDecoration: "none",
                fontSize: "11px",
                padding: "5px 10px",
                borderRadius: "6px",
                background: "rgba(16,185,129,0.05)",
                border: "1px solid rgba(16,185,129,0.12)",
                transition: "background 0.2s, border-color 0.2s",
                wordBreak: "break-all",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(16,185,129,0.1)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(16,185,129,0.05)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.12)"; }}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M1 5.5H10M6.5 2L10 5.5L6.5 9" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {link}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Onboarding — Employee Created */}
      {data.employee_id && (
        <div style={{
          width: "100%",
          background: "linear-gradient(180deg, rgba(16,185,129,0.1), rgba(6,28,21,0.92))",
          border: "1px solid rgba(16,185,129,0.22)",
          borderRadius: "12px",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxShadow: "inset 0 1px 0 rgba(167,243,208,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <div style={{
                width: "24px", height: "24px", borderRadius: "999px",
                background: "rgba(16,185,129,0.14)",
                border: "1px solid rgba(16,185,129,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
                <span style={{ color: "rgba(167,243,208,0.45)", fontSize: "10px", letterSpacing: "0.12em" }}>
                  ONBOARDING STATUS
                </span>
                <span style={{ color: "#6ee7b7", fontSize: "13px", letterSpacing: "0.08em", fontWeight: 700 }}>
                  EMPLOYEE CREATED
                </span>
              </div>
            </div>
            <span style={{
              color: "rgba(167,243,208,0.5)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}>
              ACTIVE
            </span>
          </div>

          <div style={{ height: "1px", background: "rgba(52,211,153,0.1)" }} />

          <div style={{ display: "grid", gridTemplateColumns: "88px minmax(0, 1fr)", gap: "8px 12px", alignItems: "start" }}>
            <span style={{ color: "rgba(167,243,208,0.4)", fontSize: "10px", letterSpacing: "0.1em" }}>ID</span>
            <span style={{ color: "#ecfdf5", fontSize: "12px", fontWeight: 700, wordBreak: "break-word" }}>
              {data.employee_id}
            </span>

            {data.welcome_file && (
              <>
                <span style={{ color: "rgba(167,243,208,0.4)", fontSize: "10px", letterSpacing: "0.1em" }}>FILE</span>
                <span style={{ color: "#d1fae5", fontSize: "12px", wordBreak: "break-word" }}>
                  {data.welcome_file}
                </span>
              </>
            )}

            {data.storage && (
              <>
                <span style={{ color: "rgba(167,243,208,0.4)", fontSize: "10px", letterSpacing: "0.1em" }}>STORAGE</span>
                <span style={{ color: "#d1fae5", fontSize: "12px", wordBreak: "break-word" }}>
                  {data.storage}
                </span>
              </>
            )}
          </div>

          <p style={{ margin: 0, color: "rgba(209,250,229,0.62)", fontSize: "11px", lineHeight: 1.7 }}>
            The welcome file is available for the onboarded employee in the chat workspace.
          </p>
        </div>
      )}

    </div>
  );
}
