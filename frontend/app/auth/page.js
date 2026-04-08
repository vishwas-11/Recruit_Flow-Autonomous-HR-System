// "use client";
// import { useState } from "react";
// import API from "@/services/api";
// import { saveToken } from "@/utils/auth";
// import { useRouter } from "next/navigation";

// export default function AuthPage() {
//   const router = useRouter();

//   const [isLogin, setIsLogin] = useState(true);
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "user"
//   });

//   const handleSubmit = async () => {
//     try {
//       if (isLogin) {
//         const res = await API.post("/auth/login", {
//           email: form.email,
//           password: form.password,
//         });

//         saveToken(res.data.access_token);
//         router.push("/chat");
//       } else {
//         await API.post("/auth/register", form);
//         alert("Registered successfully!");
//         setIsLogin(true);
//       }
//     } catch (err) {
//       alert(err.response?.data?.detail || "Error");
//     }
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
//       <div className="bg-gray-800 p-8 rounded-lg w-96">
//         <h2 className="text-2xl mb-4">
//           {isLogin ? "Login" : "Register"}
//         </h2>

//         {!isLogin && (
//           <>
//             <input
//               placeholder="Username"
//               className="w-full p-2 mb-2 bg-gray-700"
//               onChange={(e) =>
//                 setForm({ ...form, username: e.target.value })
//               }
//             />

//             <select
//               className="w-full p-2 mb-2 bg-gray-700"
//               onChange={(e) =>
//                 setForm({ ...form, role: e.target.value })
//               }
//             >
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//           </>
//         )}

//         <input
//           placeholder="Email"
//           className="w-full p-2 mb-2 bg-gray-700"
//           onChange={(e) =>
//             setForm({ ...form, email: e.target.value })
//           }
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-2 mb-4 bg-gray-700"
//           onChange={(e) =>
//             setForm({ ...form, password: e.target.value })
//           }
//         />

//         <button
//           onClick={handleSubmit}
//           className="w-full bg-blue-500 p-2 rounded"
//         >
//           {isLogin ? "Login" : "Register"}
//         </button>

//         <p
//           className="mt-4 text-sm cursor-pointer"
//           onClick={() => setIsLogin(!isLogin)}
//         >
//           {isLogin
//             ? "Create account"
//             : "Already have an account?"}
//         </p>
//       </div>
//     </div>
//   );
// }








"use client";
import { useState } from "react";
import API from "@/services/api";
import { saveToken } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        const res = await API.post("/auth/login", { email: form.email, password: form.password });
        saveToken(res.data.access_token);
        router.push("/chat");
      } else {
        await API.post("/auth/register", form);
        alert("Registered successfully!");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          background: #020c0a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
          pointer-events: none;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(5, 20, 16, 0.85);
          border: 1px solid rgba(52, 211, 153, 0.15);
          border-radius: 16px;
          padding: 40px 36px;
          backdrop-filter: blur(16px);
          animation: fadeUp 0.6s ease both;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }

        .auth-logo-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(16,185,129,0.4);
        }

        .auth-logo-text {
          font-family: 'Space Mono', monospace;
          font-size: 15px;
          font-weight: 700;
          color: #ecfdf5;
          letter-spacing: -0.02em;
        }

        .auth-logo-text span { color: #10b981; }

        .auth-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 26px;
          color: #ecfdf5;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .auth-sub {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(167,243,208,0.45);
          margin-bottom: 28px;
        }

        .field-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          color: rgba(167,243,208,0.5);
          margin-bottom: 6px;
          display: block;
        }

        .field-wrap {
          margin-bottom: 16px;
        }

        .auth-input {
          width: 100%;
          background: rgba(16,185,129,0.05);
          border: 1px solid rgba(52,211,153,0.15);
          border-radius: 8px;
          padding: 11px 14px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: #d1fae5;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          caret-color: #10b981;
        }

        .auth-input::placeholder { color: rgba(167,243,208,0.25); }

        .auth-input:focus {
          border-color: rgba(16,185,129,0.5);
          background: rgba(16,185,129,0.08);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
        }

        .auth-select {
          width: 100%;
          background: rgba(16,185,129,0.05);
          border: 1px solid rgba(52,211,153,0.15);
          border-radius: 8px;
          padding: 11px 14px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: #d1fae5;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%2310b981' stroke-width='1.5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .auth-select:focus {
          border-color: rgba(16,185,129,0.5);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
        }

        .auth-select option { background: #020c0a; color: #d1fae5; }

        .divider {
          height: 1px;
          background: rgba(52,211,153,0.1);
          margin: 24px 0;
        }

        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 8px;
          padding: 13px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 0 24px rgba(16,185,129,0.3);
          transition: box-shadow 0.2s, transform 0.15s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-submit:hover:not(:disabled) {
          box-shadow: 0 0 36px rgba(16,185,129,0.5);
          transform: translateY(-1px);
        }

        .btn-submit:active:not(:disabled) { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .toggle-text {
          margin-top: 20px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: rgba(167,243,208,0.4);
          text-align: center;
        }

        .toggle-link {
          color: #10b981;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s;
        }

        .toggle-link:hover { color: #6ee7b7; }

        .tab-row {
          display: flex;
          gap: 0;
          background: rgba(16,185,129,0.05);
          border: 1px solid rgba(52,211,153,0.12);
          border-radius: 8px;
          padding: 3px;
          margin-bottom: 28px;
        }

        .tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          padding: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(167,243,208,0.4);
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
        }

        .tab-btn.active {
          background: rgba(16,185,129,0.15);
          color: #10b981;
          border: 1px solid rgba(16,185,129,0.25);
        }

        .fields-enter {
          animation: fadeUp 0.3s ease both;
        }
      `}</style>

      <div className="auth-root">
        <div className="grid-bg" />
        <div className="orb" style={{ width: 500, height: 500, background: "rgba(16,185,129,0.1)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
                <circle cx="9" cy="9" r="2.5" fill="#fff"/>
              </svg>
            </div>
            <span className="auth-logo-text">Recruit<span>Flow</span></span>
          </div>

          {/* Tab switcher */}
          <div className="tab-row">
            <button className={`tab-btn ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>
              LOG IN
            </button>
            <button className={`tab-btn ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
              REGISTER
            </button>
          </div>

          <div className="auth-heading">{isLogin ? "Welcome back" : "Create account"}</div>
          <div className="auth-sub">{isLogin ? "// ENTER YOUR CREDENTIALS TO CONTINUE" : "// FILL IN DETAILS TO GET STARTED"}</div>

          {/* Register-only fields */}
          {!isLogin && (
            <div className="fields-enter">
              <div className="field-wrap">
                <label className="field-label">USERNAME</label>
                <input
                  className="auth-input"
                  placeholder="e.g. john_doe"
                  onKeyDown={handleKey}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div className="field-wrap">
                <label className="field-label">ROLE</label>
                <select
                  className="auth-select"
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          )}

          {/* Shared fields */}
          <div className="field-wrap">
            <label className="field-label">EMAIL</label>
            <input
              className="auth-input"
              placeholder="you@company.com"
              type="email"
              onKeyDown={handleKey}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="field-wrap" style={{ marginBottom: 0 }}>
            <label className="field-label">PASSWORD</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              onKeyDown={handleKey}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="divider" />

          <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><div className="spinner" /> PROCESSING...</>
              : <>{isLogin ? "LOG IN" : "CREATE ACCOUNT"}
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5H11M7.5 3L11 6.5L7.5 10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
            }
          </button>

          <p className="toggle-text">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Register here" : "Log in"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}