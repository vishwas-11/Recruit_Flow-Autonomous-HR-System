"use client";

import { useCallback, useEffect, useState } from "react";
import API from "@/services/api";
import { getToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("employees");
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const token = getToken();
      const [empRes, candRes, resRes] = await Promise.all([
        API.get("/admin/employees", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/admin/candidates", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/admin/research",   { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setEmployees(empRes.data);
      setCandidates(candRes.data);
      setResearch(resRes.data);
    } catch (err) {
      console.error(err);
      router.push("/chat");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const tabs = [
    {
      id: "employees",
      label: "Employees",
      tag: "ONBOARDED",
      count: employees.length,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M2.5 11.5C2.5 9.6 4.6 8 7 8C9.4 8 11.5 9.6 11.5 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: "candidates",
      label: "Conversations",
      tag: "INTERVIEW",
      count: candidates.length,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M5 5H9M5 7H8M5 9H7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: "research",
      label: "Research Logs",
      tag: "SCRAPED",
      count: research.length,
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M4.5 6H7.5M6 4.5V7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  const activeData = activeTab === "employees" ? employees : activeTab === "candidates" ? candidates : research;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adm-root {
          min-height: 100vh;
          background: #020c0a;
          color: #d1fae5;
          font-family: 'Syne', sans-serif;
          position: relative;
        }

        .grid-bg {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }

        /* HEADER */
        .adm-header {
          position: sticky; top: 0; z-index: 20;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; height: 62px;
          background: rgba(2,12,10,0.92);
          border-bottom: 1px solid rgba(52,211,153,0.12);
          backdrop-filter: blur(12px);
        }
        .adm-header-left { display: flex; align-items: center; gap: 12px; }
        .adm-logo-icon {
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 12px rgba(16,185,129,0.35);
          cursor: pointer;
        }
        .adm-logo-text {
          font-family: 'Space Mono', monospace;
          font-size: 14px; font-weight: 700; color: #ecfdf5; letter-spacing: -0.02em;
        }
        .adm-logo-text span { color: #10b981; }
        .adm-breadcrumb {
          font-family: 'Space Mono', monospace;
          font-size: 10px; letter-spacing: 0.1em;
          color: rgba(167,243,208,0.3);
          display: flex; align-items: center; gap: 6px;
        }
        .adm-breadcrumb-sep { color: rgba(52,211,153,0.2); }

        .adm-badge {
          font-family: 'Space Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em; font-weight: 700;
          padding: 4px 10px; border-radius: 999px;
          background: rgba(167,139,250,0.12);
          border: 1px solid rgba(167,139,250,0.3);
          color: #c4b5fd;
        }

        .btn-back {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.1em; font-weight: 700;
          padding: 6px 14px; border-radius: 6px;
          border: 1px solid rgba(52,211,153,0.2);
          background: transparent; color: rgba(167,243,208,0.5);
          cursor: pointer; transition: all 0.2s;
        }
        .btn-back:hover { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.35); color: #6ee7b7; }

        /* BODY */
        .adm-body {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 36px 32px;
        }

        /* HEADING */
        .adm-heading-row {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 32px; flex-wrap: wrap; gap: 16px;
        }
        .adm-eyebrow {
          font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.16em;
          color: rgba(16,185,129,0.7); margin-bottom: 6px;
        }
        .adm-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(28px, 3.5vw, 42px); color: #ecfdf5;
          letter-spacing: -0.02em; line-height: 1.1;
        }

        /* STAT CARDS */
        .stat-row {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: rgba(16,185,129,0.04);
          border: 1px solid rgba(52,211,153,0.12);
          border-radius: 12px; padding: 18px 20px;
          display: flex; align-items: center; gap: 14px;
          transition: border-color 0.2s, background 0.2s;
        }
        .stat-card:hover { border-color: rgba(16,185,129,0.25); background: rgba(16,185,129,0.07); }
        .stat-icon {
          width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          color: #10b981;
        }
        .stat-num {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 28px; color: #10b981; letter-spacing: -0.03em; line-height: 1;
        }
        .stat-label {
          font-family: 'Space Mono', monospace; font-size: 9px;
          letter-spacing: 0.1em; color: rgba(167,243,208,0.4); margin-top: 3px;
        }

        /* TABS */
        .tab-bar {
          display: flex; gap: 4px; margin-bottom: 20px;
          background: rgba(16,185,129,0.04);
          border: 1px solid rgba(52,211,153,0.1);
          border-radius: 10px; padding: 4px;
          width: fit-content;
        }
        .tab-btn {
          display: flex; align-items: center; gap: 7px;
          font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.1em; font-weight: 700;
          padding: 7px 16px; border-radius: 7px; border: 1px solid transparent;
          background: transparent; color: rgba(167,243,208,0.4);
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .tab-btn.active {
          background: rgba(16,185,129,0.12);
          border-color: rgba(16,185,129,0.3); color: #6ee7b7;
        }
        .tab-btn:hover:not(.active) { color: rgba(167,243,208,0.65); }
        .tab-count {
          background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.25);
          color: #10b981; border-radius: 999px;
          font-size: 9px; padding: 1px 6px; font-weight: 700;
        }
        .tab-btn.active .tab-count { background: rgba(16,185,129,0.25); border-color: rgba(16,185,129,0.4); }

        /* TABLE */
        .table-wrap {
          background: rgba(5,20,16,0.6);
          border: 1px solid rgba(52,211,153,0.1);
          border-radius: 12px; overflow: hidden;
        }
        .table-header-row {
          display: grid; padding: 10px 20px;
          background: rgba(16,185,129,0.05);
          border-bottom: 1px solid rgba(52,211,153,0.08);
        }
        .th {
          font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 0.12em; font-weight: 700;
          color: rgba(167,243,208,0.35);
        }
        .table-body { display: flex; flex-direction: column; }
        .table-row {
          display: grid; padding: 14px 20px;
          border-bottom: 1px solid rgba(52,211,153,0.06);
          transition: background 0.15s;
        }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: rgba(16,185,129,0.04); }
        .td {
          font-family: 'Space Mono', monospace; font-size: 12px;
          color: rgba(209,250,229,0.7);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          display: flex; align-items: center;
        }
        .td-primary { color: #ecfdf5; font-weight: 700; }

        /* Empty state */
        .empty-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 10px; padding: 48px;
          color: rgba(167,243,208,0.2);
        }
        .empty-state p { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.08em; }

        /* Loading */
        .loading-state {
          display: flex; align-items: center; justify-content: center;
          min-height: 60vh; gap: 10px;
        }
        .loading-state p {
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.1em;
          color: rgba(167,243,208,0.3);
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .fade-up-2 { animation: fadeUp 0.4s 0.08s ease both; }
        .fade-up-3 { animation: fadeUp 0.4s 0.16s ease both; }
      `}</style>

      <div className="adm-root">
        <div className="grid-bg" />

        {/* HEADER */}
        <header className="adm-header">
          <div className="adm-header-left">
            <div className="adm-logo-icon" onClick={() => router.push("/")}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
                <circle cx="9" cy="9" r="2.5" fill="#fff"/>
              </svg>
            </div>
            <span className="adm-logo-text">Recruit<span>Flow</span></span>
            <div className="adm-breadcrumb">
              <span className="adm-breadcrumb-sep">/</span>
              <span>ADMIN</span>
              <span className="adm-breadcrumb-sep">/</span>
              <span>DASHBOARD</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="adm-badge">ADMIN</span>
            <button className="btn-back" onClick={() => router.push("/chat")}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M7 2L4 5.5L7 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              BACK TO CHAT
            </button>
          </div>
        </header>

        <div className="adm-body">
          {loading ? (
            <div className="loading-state">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.7s linear infinite" }}>
                <circle cx="8" cy="8" r="6" stroke="rgba(52,211,153,0.2)" strokeWidth="1.5"/>
                <path d="M8 2A6 6 0 0 1 14 8" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p> LOADING DATA...</p>
            </div>
          ) : (
            <>
              {/* Heading */}
              <div className="adm-heading-row fade-up">
                <div>
                  <p className="adm-eyebrow"> ADMIN DASHBOARD</p>
                  <h1 className="adm-title">Command Center</h1>
                </div>
              </div>

              {/* Stat cards */}
              <div className="stat-row fade-up-2">
                {tabs.map(tab => (
                  <div key={tab.id} className="stat-card" onClick={() => setActiveTab(tab.id)} style={{ cursor: "pointer" }}>
                    <div className="stat-icon">{tab.icon}</div>
                    <div>
                      <div className="stat-num">
                        {tab.id === "employees" ? employees.length : tab.id === "candidates" ? candidates.length : research.length}
                      </div>
                      <div className="stat-label">{tab.tag}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabs + Table */}
              <div className="fade-up-3">
                <div className="tab-bar">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon}
                      {tab.label.toUpperCase()}
                      <span className="tab-count">
                        {tab.id === "employees" ? employees.length : tab.id === "candidates" ? candidates.length : research.length}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="table-wrap">
                  {/* EMPLOYEES */}
                  {activeTab === "employees" && (
                    <>
                      <div className="table-header-row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                        <span className="th">USERNAME</span>
                        <span className="th">EMPLOYEE ID</span>
                        <span className="th">WELCOME FILE</span>
                      </div>
                      <div className="table-body">
                        {employees.length === 0 ? (
                          <div className="empty-state"><p> NO EMPLOYEES FOUND</p></div>
                        ) : employees.map((emp, i) => (
                          <div key={i} className="table-row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                            <span className="td td-primary">{emp.username || "—"}</span>
                            <span className="td">{emp.employee_id || "—"}</span>
                            <span className="td">{emp.welcome_document?.file_name || emp.welcome_file || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* CANDIDATES */}
                  {activeTab === "candidates" && (
                    <>
                      <div className="table-header-row" style={{ gridTemplateColumns: "1fr 3fr" }}>
                        <span className="th">USER ID</span>
                        <span className="th">MESSAGE</span>
                      </div>
                      <div className="table-body">
                        {candidates.length === 0 ? (
                          <div className="empty-state"><p> NO CANDIDATES FOUND</p></div>
                        ) : candidates.map((c, i) => (
                          <div key={i} className="table-row" style={{ gridTemplateColumns: "1fr 3fr" }}>
                            <span className="td td-primary">{c.user_id || "—"}</span>
                            <span className="td">{c.message || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* RESEARCH */}
                  {activeTab === "research" && (
                    <>
                      <div className="table-header-row" style={{ gridTemplateColumns: "1fr" }}>
                        <span className="th">LOG MESSAGE</span>
                      </div>
                      <div className="table-body">
                        {research.length === 0 ? (
                          <div className="empty-state"><p> NO RESEARCH LOGS FOUND</p></div>
                        ) : research.map((r, i) => (
                          <div key={i} className="table-row" style={{ gridTemplateColumns: "1fr" }}>
                            <span className="td">{r.message || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function AdminPageWrapper() {
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
