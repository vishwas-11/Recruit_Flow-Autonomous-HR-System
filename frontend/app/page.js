"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">
        RecruitFlow 🚀
      </h1>

      <p className="mb-6 text-gray-300">
        AI Powered Hiring & Onboarding System
      </p>

      <button
        onClick={() => router.push("/auth")}
        className="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        Get Started
      </button>
    </div>
  );
}