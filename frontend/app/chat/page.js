"use client";

import { useState } from "react";
import API from "@/services/api";
import { getToken, removeToken, getUserRole } from "@/utils/auth";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import StructuredResponse from "@/components/StructuredResponse";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const role = getUserRole();

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await API.post(
        "/chat",
        { message },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const botMsg = {
        role: "assistant",
        content: res.data,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    }

    setMessage("");
  };

  const handleLogout = () => {
    removeToken();
    router.push("/auth");
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-gray-900 text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 bg-gray-800 shadow">
          <h1 className="text-xl font-bold">RecruitFlow Chat</h1>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded text-sm font-semibold ${
                role === "admin"
                  ? "bg-purple-600"
                  : "bg-green-600"
              }`}
            >
              {role?.toUpperCase()}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-xl ${
                msg.role === "user"
                  ? "bg-blue-600 ml-auto"
                  : "bg-gray-700"
              }`}
            >
              {(() => {
                try {
                  const parsed =
                    typeof msg.content === "string"
                      ? JSON.parse(msg.content)
                      : msg.content;

                  return typeof parsed === "object" ? (
                    <StructuredResponse data={parsed} />
                  ) : (
                    <p>{msg.content}</p>
                  );
                } catch {
                  return <p>{msg.content}</p>;
                }
              })()}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-4 bg-gray-800 flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded bg-gray-700 outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}