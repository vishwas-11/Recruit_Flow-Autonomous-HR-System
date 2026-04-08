"use client";
import { useState } from "react";
import API from "@/services/api";
import { saveToken } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await API.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        saveToken(res.data.access_token);
        router.push("/chat");
      } else {
        await API.post("/auth/register", form);
        alert("Registered successfully!");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg w-96">
        <h2 className="text-2xl mb-4">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <>
            <input
              placeholder="Username"
              className="w-full p-2 mb-2 bg-gray-700"
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />

            <select
              className="w-full p-2 mb-2 bg-gray-700"
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}

        <input
          placeholder="Email"
          className="w-full p-2 mb-2 bg-gray-700"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-gray-700"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 p-2 rounded"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="mt-4 text-sm cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Create account"
            : "Already have an account?"}
        </p>
      </div>
    </div>
  );
}