"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      console.warn("🔐 No token found → redirecting to auth");
      router.push("/auth");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (adminOnly && payload.role !== "admin") {
        console.warn("⛔ Unauthorized access attempt to admin dashboard");

        toast.error("Access Denied: Admins only");

        router.push("/chat");
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error("❌ Invalid token:", err);
      router.push("/auth");
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return children;
}