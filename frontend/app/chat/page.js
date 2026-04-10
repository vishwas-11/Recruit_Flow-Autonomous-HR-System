"use client";

import React, { useState, useRef, useEffect } from "react";
import API from "@/services/api";
import { getToken, removeToken, getUserRole } from "@/utils/auth";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import StructuredResponse from "@/components/StructuredResponse";

const AGENTS = {
  user: [
    {
      id: "interview",
      label: "Interview Agent",
      tag: "INTERVIEW",
      desc: "Prepare for interviews, get question sets, and receive feedback on your responses.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M3 13C3 10.8 5.2 9 8 9C10.8 9 13 10.8 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      examples: ["Prepare me for a React interview", "Give me 5 system design questions", "What should I expect in a technical round?"],
    },
    {
      id: "scheduler",
      label: "Schedule Agent",
      tag: "SCHEDULER",
      desc: "Schedule, reschedule, or check your interview slots and calendar availability.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M5 2V4M11 2V4M2 7H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
        </svg>
      ),
      examples: ["Schedule an interview for Monday 10am", "What slots are available this week?", "Reschedule my Friday interview"],
    },
  ],
  admin: [
    {
      id: "interview",
      label: "Interview Agent",
      tag: "INTERVIEW",
      desc: "Manage interview pipelines, generate question banks, and review candidate assessments.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M3 13C3 10.8 5.2 9 8 9C10.8 9 13 10.8 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      examples: ["Show all scheduled interviews today", "Generate senior engineer question bank", "Summarize candidate John's assessment"],
    },
    {
      id: "scheduler",
      label: "Schedule Agent",
      tag: "SCHEDULER",
      desc: "Manage and coordinate interview schedules across candidates and interviewers.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M5 2V4M11 2V4M2 7H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
        </svg>
      ),
      examples: ["Schedule 3 back-to-back interviews on Thursday", "Show all open slots this week", "Cancel all interviews for candidate #42"],
    },
    {
      id: "research",
      label: "Research Agent",
      tag: "RESEARCH",
      desc: "Scrape the web to research candidates, companies, and market intelligence.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M5 7H9M7 5V9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      ),
      examples: ["Research John Smith's LinkedIn and GitHub", "Find top React engineers in Bangalore", "Scrape salary benchmarks for senior devs"],
      adminOnly: true,
    },
  ],
};

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [agentMessages, setAgentMessages] = useState({});  // { agentId: [...msgs] }
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeAgent, setActiveAgent] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(true);
  const router = useRouter();
  const role = getUserRole();
  const agents = AGENTS[role] || AGENTS.user;
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const messages = agentMessages[activeAgent] || [];

  const buildAgentBuckets = () =>
    agents.reduce((acc, agent) => {
      acc[agent.id] = [];
      return acc;
    }, {});

  const setMessages = (updater) => {
    setAgentMessages((prev) => ({
      ...prev,
      [activeAgent]: typeof updater === "function" ? updater(prev[activeAgent] || []) : updater,
    }));
  };

  useEffect(() => {
    setAgentMessages((prev) => {
      const next = buildAgentBuckets();
      Object.entries(prev).forEach(([agentId, agentHistory]) => {
        next[agentId] = agentHistory;
      });
      return next;
    });

    if (!activeAgent && agents.length > 0) {
      setActiveAgent(agents[0].id);
    }
  }, [role]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentMessages, activeAgent, loading, historyLoading]);

  useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await API.get("/chat/history", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const groupedMessages = buildAgentBuckets();
        (res.data?.history || []).forEach((entry) => {
          const fallbackAgent = entry.type === "research" ? "research" : "interview";
          const agentId = groupedMessages[entry.agent] !== undefined ? entry.agent : fallbackAgent;

          if (groupedMessages[agentId] === undefined) {
            groupedMessages[agentId] = [];
          }

          groupedMessages[agentId].push({
            role: entry.role,
            content: entry.content,
            timestamp: entry.timestamp,
          });
        });

        setAgentMessages(groupedMessages);
      } catch (err) {
        console.error("Failed to fetch chat history", err);
        setAgentMessages(buildAgentBuckets());
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [role]);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await API.get("/calendar", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setBookedSlots(res.data || []);
      } catch (err) {
        console.error("Failed to fetch calendar", err);
      }
    };
    fetchCalendar();
  }, []);

  const sendMessage = async (overrideText) => {
    const text = overrideText || message;
    if (!text.trim() || loading) return;
    setMessage("");
    if (inputRef.current) { inputRef.current.style.height = "auto"; }
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await API.post(
        "/chat",
        { message: text, agent: activeAgent },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleLogout = () => { removeToken(); router.push("/auth"); };

  const renderContent = (msg) => {
    try {
      const parsed = typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
      return typeof parsed === "object"
        ? <StructuredResponse data={parsed} />
        : <p style={{ margin: 0, lineHeight: 1.7 }}>{msg.content}</p>;
    } catch {
      return <p style={{ margin: 0, lineHeight: 1.7 }}>{msg.content}</p>;
    }
  };

  const currentAgent = activeAgent ? agents.find(a => a.id === activeAgent) : null;

  return (
    <ProtectedRoute>
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          .chat-root {
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: #020c0a;
            color: #d1fae5;
            font-family: 'Syne', sans-serif;
            overflow: hidden;
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
          .chat-header {
            position: relative; z-index: 10;
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 24px; height: 62px;
            background: rgba(2,12,10,0.92);
            border-bottom: 1px solid rgba(52,211,153,0.12);
            backdrop-filter: blur(12px);
            flex-shrink: 0;
          }
          .header-logo {
            display: flex; align-items: center; gap: 10px; cursor: pointer;
          }
          .header-logo-icon {
            width: 30px; height: 30px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 7px;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0 12px rgba(16,185,129,0.35);
          }
          .header-logo-text {
            font-family: 'Space Mono', monospace;
            font-size: 14px; font-weight: 700; color: #ecfdf5; letter-spacing: -0.02em;
          }
          .header-logo-text span { color: #10b981; }
          .header-right { display: flex; align-items: center; gap: 12px; }
          .role-badge {
            font-family: 'Space Mono', monospace;
            font-size: 10px; letter-spacing: 0.12em; font-weight: 700;
            padding: 4px 12px; border-radius: 999px;
          }
          .role-admin { background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.3); color: #c4b5fd; }
          .role-user  { background: rgba(16,185,129,0.1);   border: 1px solid rgba(16,185,129,0.25);  color: #6ee7b7; }
          .btn-logout {
            display: flex; align-items: center; gap: 6px;
            font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.1em; font-weight: 700;
            padding: 6px 14px; border-radius: 6px;
            border: 1px solid rgba(239,68,68,0.25); background: rgba(239,68,68,0.06); color: rgba(252,165,165,0.7);
            cursor: pointer; transition: background 0.2s, border-color 0.2s, color 0.2s;
          }
          .btn-logout:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.45); color: #fca5a5; }

          /* BODY */
          .chat-layout {
            flex: 1; display: flex; overflow: hidden; position: relative; z-index: 1;
          }

          /* SIDEBAR */
          .agent-sidebar {
            width: 240px; flex-shrink: 0;
            border-right: 1px solid rgba(52,211,153,0.1);
            background: rgba(2,10,8,0.7);
            display: flex; flex-direction: column;
            padding: 20px 14px;
            gap: 6px;
            overflow-y: auto;
          }
          .sidebar-label {
            font-family: 'Space Mono', monospace;
            font-size: 9px; letter-spacing: 0.14em;
            color: rgba(167,243,208,0.3);
            padding: 0 6px; margin-bottom: 6px;
          }

          .agent-btn {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 12px; border-radius: 9px;
            border: 1px solid transparent;
            background: transparent;
            cursor: pointer;
            transition: background 0.2s, border-color 0.2s;
            text-align: left; width: 100%;
          }
          .agent-btn:hover {
            background: rgba(16,185,129,0.06);
            border-color: rgba(52,211,153,0.15);
          }
          .agent-btn.active {
            background: rgba(16,185,129,0.1);
            border-color: rgba(16,185,129,0.3);
          }
          .agent-btn.active .agent-icon { color: #10b981; }
          .agent-icon {
            width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            background: rgba(16,185,129,0.08);
            border: 1px solid rgba(52,211,153,0.15);
            color: rgba(167,243,208,0.5);
            transition: color 0.2s;
          }
          .agent-btn-text { overflow: hidden; }
          .agent-btn-name {
            font-family: 'Syne', sans-serif;
            font-size: 13px; font-weight: 700;
            color: rgba(209,250,229,0.8);
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          }
          .agent-btn.active .agent-btn-name { color: #ecfdf5; }
          .agent-btn-tag {
            font-family: 'Space Mono', monospace;
            font-size: 9px; letter-spacing: 0.1em;
            color: rgba(167,243,208,0.3);
          }
          .agent-btn.active .agent-btn-tag { color: rgba(16,185,129,0.7); }
          .agent-btn-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 2px;
          }
          .agent-history-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 18px;
            height: 18px;
            padding: 0 6px;
            border-radius: 999px;
            border: 1px solid rgba(52,211,153,0.18);
            background: rgba(16,185,129,0.08);
            color: rgba(167,243,208,0.55);
            font-family: 'Space Mono', monospace;
            font-size: 8px;
            font-weight: 700;
          }
          .agent-btn.active .agent-history-count {
            border-color: rgba(16,185,129,0.35);
            color: #6ee7b7;
          }

          .admin-divider {
            height: 1px; background: rgba(52,211,153,0.08);
            margin: 8px 6px;
          }
          .admin-section-label {
            font-family: 'Space Mono', monospace;
            font-size: 9px; letter-spacing: 0.14em;
            color: rgba(167,139,250,0.4);
            padding: 0 6px; margin-bottom: 4px;
          }

          /* MAIN AREA */
          .chat-main {
            flex: 1; display: flex; flex-direction: column; overflow: hidden;
          }

          /* Agent context bar */
          .agent-context-bar {
            flex-shrink: 0;
            padding: 10px 20px;
            background: rgba(16,185,129,0.04);
            border-bottom: 1px solid rgba(52,211,153,0.08);
            display: flex; align-items: center; gap: 12px;
          }
          .context-tag {
            font-family: 'Space Mono', monospace;
            font-size: 10px; letter-spacing: 0.12em; font-weight: 700;
            padding: 3px 10px; border-radius: 999px;
            background: rgba(16,185,129,0.1);
            border: 1px solid rgba(16,185,129,0.25);
            color: #6ee7b7;
            flex-shrink: 0;
          }
          .context-tag.research {
            background: rgba(167,139,250,0.1);
            border-color: rgba(167,139,250,0.25);
            color: #c4b5fd;
          }
          .context-desc {
            font-family: 'Space Mono', monospace;
            font-size: 11px;
            color: rgba(167,243,208,0.4);
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          }

          /* MESSAGES */
          .chat-body {
            flex: 1; overflow-y: auto;
            padding: 24px 20px;
            display: flex; flex-direction: column; gap: 18px;
            scrollbar-width: thin;
            scrollbar-color: rgba(16,185,129,0.2) transparent;
          }
          .chat-body::-webkit-scrollbar { width: 4px; }
          .chat-body::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.2); border-radius: 4px; }

          /* No-agent state */
          .no-agent-state {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 10px;
            opacity: 0.5; padding: 40px;
          }
          .no-agent-icon {
            width: 48px; height: 48px; border-radius: 12px;
            border: 1px solid rgba(52,211,153,0.2);
            background: rgba(16,185,129,0.05);
            display: flex; align-items: center; justify-content: center;
          }
          .no-agent-title {
            font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
            color: rgba(209,250,229,0.5);
          }
          .no-agent-sub {
            font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.08em;
            color: rgba(167,243,208,0.25);
          }

          @keyframes msgIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .msg-row { display: flex; gap: 12px; animation: msgIn 0.25s ease both; }
          .msg-row.user { flex-direction: row-reverse; }

          .msg-avatar {
            width: 28px; height: 28px; border-radius: 7px;
            display: flex; align-items: center; justify-content: center;
            font-family: 'Space Mono', monospace; font-size: 8px; font-weight: 700;
            flex-shrink: 0; margin-top: 2px;
          }
          .avatar-user { background: linear-gradient(135deg, #10b981, #059669); color: #fff; box-shadow: 0 0 10px rgba(16,185,129,0.3); }
          .avatar-bot  { background: rgba(16,185,129,0.08); border: 1px solid rgba(52,211,153,0.2); color: #10b981; }
          .avatar-research { background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.25); color: #c4b5fd; }

          .msg-label {
            font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 0.1em;
            color: rgba(167,243,208,0.3); margin-bottom: 5px;
          }
          .msg-row.user .msg-label { text-align: right; }

          .msg-bubble {
            max-width: min(540px, 78%);
            padding: 11px 15px; border-radius: 12px;
            font-size: 14px; line-height: 1.7;
          }
          .bubble-user {
            background: linear-gradient(135deg, rgba(16,185,129,0.22), rgba(5,150,105,0.16));
            border: 1px solid rgba(16,185,129,0.28);
            color: #ecfdf5; border-bottom-right-radius: 3px;
          }
          .bubble-bot {
            background: rgba(5,20,16,0.85); border: 1px solid rgba(52,211,153,0.1);
            color: #d1fae5; border-bottom-left-radius: 3px;
          }

          @keyframes blink {
            0%, 80%, 100% { opacity: 0.2; transform: translateY(0); }
            40%            { opacity: 1;   transform: translateY(-3px); }
          }
          .typing-dot { width: 5px; height: 5px; background: #10b981; border-radius: 50%; display: inline-block; animation: blink 1.2s infinite; }
          .typing-dot:nth-child(2) { animation-delay: 0.2s; }
          .typing-dot:nth-child(3) { animation-delay: 0.4s; }

          /* INPUT */
          .chat-input-bar {
            flex-shrink: 0; padding: 14px 20px 18px;
            background: rgba(2,12,10,0.92);
            border-top: 1px solid rgba(52,211,153,0.1);
            backdrop-filter: blur(12px);
          }
          .input-wrap {
            display: flex; align-items: flex-end; gap: 10px;
            background: rgba(16,185,129,0.04);
            border: 1px solid rgba(52,211,153,0.15);
            border-radius: 12px; padding: 10px 12px;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .input-wrap:focus-within { border-color: rgba(16,185,129,0.4); box-shadow: 0 0 0 3px rgba(16,185,129,0.07); }
          .chat-textarea {
            flex: 1; background: transparent; border: none; outline: none; resize: none;
            font-family: 'Space Mono', monospace; font-size: 13px; color: #d1fae5; line-height: 1.6;
            caret-color: #10b981; max-height: 120px; overflow-y: auto; scrollbar-width: none;
          }
          .chat-textarea::placeholder { color: rgba(167,243,208,0.22); }
          .chat-textarea::-webkit-scrollbar { display: none; }
          .btn-send {
            width: 36px; height: 36px; border-radius: 8px; border: none;
            background: linear-gradient(135deg, #10b981, #059669); color: #fff;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; flex-shrink: 0;
            box-shadow: 0 0 14px rgba(16,185,129,0.28);
            transition: box-shadow 0.2s, transform 0.15s, opacity 0.2s;
          }
          .btn-send:hover:not(:disabled) { box-shadow: 0 0 22px rgba(16,185,129,0.5); transform: translateY(-1px); }
          .btn-send:disabled { opacity: 0.35; cursor: not-allowed; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .input-hint {
            font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.05em;
            color: rgba(167,243,208,0.18); margin-top: 8px; text-align: right;
          }

          /* Disabled input overlay when no agent selected */
          .input-disabled-note {
            font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.07em;
            color: rgba(167,243,208,0.25); text-align: center; padding: 14px;
          }

          /* CALENDAR PANEL */
          .cal-panel {
            flex-shrink: 0;
            border-left: 1px solid rgba(52,211,153,0.1);
            background: rgba(2,10,8,0.7);
            display: flex; flex-direction: column;
            overflow: hidden;
            transition: width 0.25s ease;
            width: 480px;
          }
          .cal-panel.collapsed { width: 40px; }

          .cal-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 14px 16px 12px;
            border-bottom: 1px solid rgba(52,211,153,0.08);
            flex-shrink: 0;
          }
          .cal-header-left {
            display: flex; align-items: center; gap: 8px; overflow: hidden;
          }
          .cal-title {
            font-family: 'Space Mono', monospace;
            font-size: 9px; letter-spacing: 0.14em;
            color: rgba(167,243,208,0.35);
            white-space: nowrap;
          }
          .cal-count-badge {
            display: inline-flex; align-items: center; justify-content: center;
            background: rgba(16,185,129,0.15);
            border: 1px solid rgba(16,185,129,0.3);
            color: #6ee7b7;
            font-family: 'Space Mono', monospace;
            font-size: 9px; font-weight: 700;
            width: 18px; height: 18px; border-radius: 999px;
            flex-shrink: 0;
          }
          .cal-toggle {
            background: transparent; border: none; cursor: pointer;
            color: rgba(167,243,208,0.3); padding: 2px;
            display: flex; align-items: center; justify-content: center;
            transition: color 0.2s; flex-shrink: 0;
          }
          .cal-toggle:hover { color: #10b981; }

          .cal-body {
            flex: 1; overflow: auto; padding: 14px 16px;
            scrollbar-width: thin;
            scrollbar-color: rgba(16,185,129,0.15) transparent;
          }
          .cal-body::-webkit-scrollbar { width: 3px; height: 3px; }
          .cal-body::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.15); border-radius: 3px; }

          /* GRID */
          .cal-grid {
            display: grid;
            grid-template-columns: 72px repeat(6, 1fr);
            gap: 5px;
            min-width: 400px;
          }

          .cal-grid-corner { /* empty top-left */ }

          .cal-time-header {
            font-family: 'Space Mono', monospace;
            font-size: 9px; letter-spacing: 0.08em; font-weight: 700;
            color: rgba(167,243,208,0.45);
            text-align: center; padding: 4px 2px;
          }

          .cal-day-label {
            font-family: 'Space Mono', monospace;
            font-size: 9px; letter-spacing: 0.06em; font-weight: 700;
            color: rgba(167,243,208,0.5);
            display: flex; align-items: center;
            padding-right: 6px;
            white-space: nowrap;
          }

          .cal-cell {
            border-radius: 6px;
            padding: 7px 4px;
            display: flex; align-items: center; justify-content: center;
            font-family: 'Space Mono', monospace;
            font-size: 8px; letter-spacing: 0.06em; font-weight: 700;
            transition: background 0.15s;
          }
          .cal-cell.available {
            background: rgba(16,185,129,0.06);
            border: 1px solid rgba(52,211,153,0.12);
            color: rgba(167,243,208,0.3);
          }
          .cal-cell.booked {
            background: rgba(220,38,38,0.2);
            border: 1px solid rgba(220,38,38,0.4);
            color: #fca5a5;
          }
          .cal-cell.available:hover {
            background: rgba(16,185,129,0.1);
            border-color: rgba(16,185,129,0.25);
            color: #6ee7b7;
          }

          .cal-legend {
            display: flex; gap: 14px; margin-top: 14px; padding-top: 12px;
            border-top: 1px solid rgba(52,211,153,0.08);
          }
          .cal-legend-item {
            display: flex; align-items: center; gap: 5px;
            font-family: 'Space Mono', monospace;
            font-size: 9px; letter-spacing: 0.07em;
            color: rgba(167,243,208,0.35);
          }
          .cal-legend-dot {
            width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0;
          }
        `}</style>

        <div className="chat-root">
          <div className="grid-bg" />

          {/* HEADER */}
          <header className="chat-header">
            <div className="header-logo" onClick={() => router.push("/")}>
              <div className="header-logo-icon">
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
                  <circle cx="9" cy="9" r="2.5" fill="#fff"/>
                </svg>
              </div>
              <span className="header-logo-text">Recruit<span>Flow</span></span>
            </div>
            <div className="header-right">
              <span className={`role-badge ${role === "admin" ? "role-admin" : "role-user"}`}>
                {role?.toUpperCase()}
              </span>
              {role === "admin" && (
                <button
                  onClick={() => router.push("/admin")}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    fontFamily: "'Space Mono', monospace", fontSize: "10px",
                    letterSpacing: "0.1em", fontWeight: 700,
                    padding: "6px 14px", borderRadius: "6px",
                    border: "1px solid rgba(167,139,250,0.3)",
                    background: "rgba(167,139,250,0.08)",
                    color: "#c4b5fd", cursor: "pointer",
                    transition: "background 0.2s, border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(167,139,250,0.15)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(167,139,250,0.08)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)"; }}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <rect x="1" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                    <rect x="6" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                    <rect x="1" y="6" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                    <rect x="6" y="6" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                  </svg>
                  DASHBOARD
                </button>
              )}
              <button className="btn-logout" onClick={handleLogout}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 2H2.5C2 2 1.5 2.5 1.5 3V9C1.5 9.5 2 10 2.5 10H4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M8 4L10.5 6L8 8M10.5 6H4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                LOGOUT
              </button>
            </div>
          </header>

          <div className="chat-layout">

            {/* SIDEBAR */}
            <aside className="agent-sidebar">
              <p className="sidebar-label"> AGENTS</p>

              {agents.filter(a => !a.adminOnly).map((agent) => (
                <button
                  key={agent.id}
                  className={`agent-btn ${activeAgent === agent.id ? "active" : ""}`}
                  onClick={() => setActiveAgent(agent.id)}
                >
                  <div className="agent-icon">{agent.icon}</div>
                  <div className="agent-btn-text">
                    <div className="agent-btn-name">{agent.label}</div>
                    <div className="agent-btn-meta">
                      <div className="agent-btn-tag">{agent.tag}</div>
                      {!!agentMessages[agent.id]?.length && (
                        <span className="agent-history-count">{agentMessages[agent.id].length}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {role === "admin" && (
                <>
                  <div className="admin-divider" />
                  <p className="admin-section-label"> ADMIN ONLY</p>
                  {agents.filter(a => a.adminOnly).map((agent) => (
                    <button
                      key={agent.id}
                      className={`agent-btn ${activeAgent === agent.id ? "active" : ""}`}
                      onClick={() => setActiveAgent(agent.id)}
                    >
                      <div className="agent-icon" style={activeAgent === agent.id ? { color: "#c4b5fd" } : {}}>
                        {agent.icon}
                      </div>
                      <div className="agent-btn-text">
                        <div className="agent-btn-name">{agent.label}</div>
                        <div className="agent-btn-meta">
                          <div className="agent-btn-tag" style={{ color: activeAgent === agent.id ? "rgba(167,139,250,0.6)" : undefined }}>
                            {agent.tag}
                          </div>
                          {!!agentMessages[agent.id]?.length && (
                            <span className="agent-history-count">{agentMessages[agent.id].length}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </aside>

            {/* MAIN CHAT */}
            <div className="chat-main">

              {/* Agent context bar */}
              {currentAgent && (
                <div className="agent-context-bar">
                  <span className={`context-tag ${currentAgent.id === "research" ? "research" : ""}`}>
                    {currentAgent.tag}
                  </span>
                  <span className="context-desc">{currentAgent.desc}</span>
                </div>
              )}

              {/* Messages */}
              <div className="chat-body">
                {!activeAgent && (
                  <div className="no-agent-state">
                    <div className="no-agent-icon">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M11 4L18 8V14L11 18L4 14V8L11 4Z" stroke="#10b981" strokeWidth="1.2" fill="none"/>
                        <circle cx="11" cy="11" r="2.5" stroke="#10b981" strokeWidth="1.2"/>
                      </svg>
                    </div>
                    <p className="no-agent-title">Select an agent</p>
                    <p className="no-agent-sub"> CHOOSE FROM THE SIDEBAR TO BEGIN</p>
                  </div>
                )}

                {activeAgent && historyLoading && messages.length === 0 && !loading && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", color: "rgba(167,243,208,0.25)" }}>
                      LOADING CONVERSATION HISTORY
                    </p>
                  </div>
                )}

                {activeAgent && !historyLoading && messages.length === 0 && !loading && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", color: "rgba(167,243,208,0.2)" }}>
                       SEND A MESSAGE TO START
                    </p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`msg-row ${msg.role === "user" ? "user" : ""}`}>
                    <div className={`msg-avatar ${
                      msg.role === "user" ? "avatar-user"
                      : currentAgent?.id === "research" ? "avatar-research"
                      : "avatar-bot"
                    }`}>
                      {msg.role === "user" ? "YOU" : currentAgent?.tag?.slice(0,2) || "AI"}
                    </div>
                    <div>
                      <div className="msg-label">
                        {msg.role === "user" ? "YOU" : `${currentAgent?.label?.toUpperCase() || "AI"}`}
                      </div>
                      <div className={`msg-bubble ${msg.role === "user" ? "bubble-user" : "bubble-bot"}`}>
                        {renderContent(msg)}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="msg-row">
                    <div className={`msg-avatar ${currentAgent?.id === "research" ? "avatar-research" : "avatar-bot"}`}>
                      {currentAgent?.tag?.slice(0,2) || "AI"}
                    </div>
                    <div>
                      <div className="msg-label">{currentAgent?.label?.toUpperCase() || "AI"}</div>
                      <div className="msg-bubble bubble-bot" style={{ padding: "14px 18px" }}>
                        <span className="typing-dot" />
                        <span className="typing-dot" style={{ margin: "0 4px" }} />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="chat-input-bar">
                {!activeAgent
                  ? <p className="input-disabled-note"> SELECT AN AGENT FROM THE SIDEBAR TO START CHATTING</p>
                  : <>
                      <div className="input-wrap">
                        <textarea
                          ref={inputRef}
                          className="chat-textarea"
                          rows={1}
                          value={message}
                          placeholder={
                            currentAgent?.id === "interview" ? "Ask about interviews or request a question set..." :
                            currentAgent?.id === "scheduler" ? "Schedule, reschedule, or check availability..." :
                            currentAgent?.id === "research"  ? "Research a candidate, company, or market..." :
                            "Type a message..."
                          }
                          onChange={(e) => {
                            setMessage(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                          }}
                          onKeyDown={handleKeyDown}
                        />
                        <button className="btn-send" onClick={() => sendMessage()} disabled={loading || !message.trim()}>
                          {loading
                            ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.7s linear infinite" }}>
                                <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                                <path d="M7 2A5 5 0 0 1 12 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            : <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7H12M8 3L12 7L8 11" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                          }
                        </button>
                      </div>
                      <p className="input-hint">ENTER to send · SHIFT+ENTER for new line</p>
                    </>
                }
              </div>
            </div>

            {/* CALENDAR PANEL */}
            <aside className={`cal-panel ${calendarOpen ? "" : "collapsed"}`}>
              <div className="cal-header">
                {calendarOpen && (
                  <div className="cal-header-left">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="rgba(167,243,208,0.4)" strokeWidth="1.1"/>
                      <path d="M4 1V3M8 1V3M1 5H11" stroke="rgba(167,243,208,0.4)" strokeWidth="1.1" strokeLinecap="round"/>
                    </svg>
                    <span className="cal-title"> INTERVIEW SCHEDULE</span>
                    {bookedSlots.length > 0 && (
                      <span className="cal-count-badge">{bookedSlots.length}</span>
                    )}
                  </div>
                )}
                <button className="cal-toggle" onClick={() => setCalendarOpen(o => !o)} title={calendarOpen ? "Collapse" : "Expand"}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    {calendarOpen
                      ? <path d="M9 2L5 7L9 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      : <path d="M5 2L9 7L5 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    }
                  </svg>
                </button>
              </div>

              {calendarOpen && (
                <div className="cal-body">
                  {(() => {
                    const DAYS  = ["monday","tuesday","wednesday","thursday","friday"];
                    const TIMES = ["10am","11am","12pm","1pm","2pm","3pm"];
                    const LABELS = { "10am":"10AM","11am":"11AM","12pm":"12PM","1pm":"1PM","2pm":"2PM","3pm":"3PM" };
                    const DAY_SHORT = { monday:"MON",tuesday:"TUE",wednesday:"WED",thursday:"THU",friday:"FRI" };

                    // build booked lookup from API data: key = "monday-10am"
                    const bookedMap = {};
                    bookedSlots.forEach(e => {
                      const key = `${(e.date||"").toLowerCase()}-${(e.time||"").toLowerCase()}`;
                      bookedMap[key] = true;
                    });

                    const bookedCount = Object.keys(bookedMap).length;

                    return (
                      <>
                        <div className="cal-grid">
                          {/* Top-left corner */}
                          <div className="cal-grid-corner" />

                          {/* Time headers */}
                          {TIMES.map(t => (
                            <div key={t} className="cal-time-header">{LABELS[t]}</div>
                          ))}

                          {/* Day rows */}
                          {DAYS.map(day => (
                            <React.Fragment key={day}>
                              <div className="cal-day-label">{DAY_SHORT[day]}</div>
                              {TIMES.map(time => {
                                const key = `${day}-${time}`;
                                const isBooked = bookedMap[key];
                                return (
                                  <div key={key} className={`cal-cell ${isBooked ? "booked" : "available"}`}>
                                    {isBooked ? "BOOKED" : "FREE"}
                                  </div>
                                );
                              })}
                            </React.Fragment>
                          ))}
                        </div>

                        <div className="cal-legend">
                          <div className="cal-legend-item">
                            <div className="cal-legend-dot" style={{ background: "rgba(220,38,38,0.4)", border: "1px solid rgba(220,38,38,0.5)" }} />
                            BOOKED ({bookedCount})
                          </div>
                          <div className="cal-legend-item">
                            <div className="cal-legend-dot" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(52,211,153,0.2)" }} />
                            FREE ({DAYS.length * TIMES.length - bookedCount})
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </aside>

          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}
