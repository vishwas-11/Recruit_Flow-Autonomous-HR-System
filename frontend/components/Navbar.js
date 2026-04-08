"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      borderBottom: "1px solid rgba(52, 211, 153, 0.15)",
      background: "rgba(2, 12, 10, 0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1.5rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
        >
          <div style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, #10b981, #059669)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(16,185,129,0.4)",
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
              <circle cx="9" cy="9" r="2.5" fill="#fff"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "16px",
            fontWeight: 700,
            color: "#ecfdf5",
            letterSpacing: "-0.02em",
          }}>
            Recruit<span style={{ color: "#10b981" }}>Flow</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="nav-links">
          {[].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "13px",
                color: "rgba(167, 243, 208, 0.7)",
                textDecoration: "none",
                letterSpacing: "0.04em",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = "#10b981"}
              onMouseLeave={e => e.target.style.color = "rgba(167, 243, 208, 0.7)"}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => router.push("/auth")}
            style={{
              background: "transparent",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              color: "#6ee7b7",
              padding: "8px 18px",
              borderRadius: "6px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.target.style.background = "rgba(16,185,129,0.1)";
              e.target.style.borderColor = "#10b981";
            }}
            onMouseLeave={e => {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "rgba(52, 211, 153, 0.4)";
            }}
          >
            LOG IN
          </button>
          <button
            onClick={() => router.push("/auth")}
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              border: "none",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: "6px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              letterSpacing: "0.06em",
              cursor: "pointer",
              fontWeight: 700,
              boxShadow: "0 0 20px rgba(16,185,129,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.target.style.boxShadow = "0 0 28px rgba(16,185,129,0.5)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.target.style.boxShadow = "0 0 20px rgba(16,185,129,0.3)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            GET STARTED
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}