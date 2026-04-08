"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { getToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";



function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [research, setResearch] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = getToken();

      const [empRes, candRes, resRes] = await Promise.all([
        API.get("/admin/employees", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        API.get("/admin/candidates", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        API.get("/admin/research", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setEmployees(empRes.data);
      setCandidates(candRes.data);
      setResearch(resRes.data);
    } catch (err) {
      console.error(err);
      router.push("/chat"); // fallback
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-8">

      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Employees */}
      <Section title="Employees">
        {employees.map((emp, i) => (
          <Card key={i}>
            <p><b>Name:</b> {emp.username}</p>
            <p><b>ID:</b> {emp.employee_id}</p>
            <p><b>Directory:</b> {emp.directory}</p>
          </Card>
        ))}
      </Section>

      {/* Candidates */}
      <Section title="Candidates (Interview)">
        {candidates.map((c, i) => (
          <Card key={i}>
            <p><b>User ID:</b> {c.user_id}</p>
            <p><b>Message:</b> {c.message}</p>
          </Card>
        ))}
      </Section>

      {/* Research */}
      <Section title="Research Logs">
        {research.map((r, i) => (
          <Card key={i}>
            <p>{r.message}</p>
          </Card>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      {children}
    </div>
  );
}

export default function AdminPageWrapper() {
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}