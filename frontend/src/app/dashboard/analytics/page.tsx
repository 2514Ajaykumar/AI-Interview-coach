"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { BarChart3, TrendingUp, Award } from "lucide-react";

const SKILL_DATA = [
  { name: "Problem Solving", value: 72, color: "#6366f1" },
  { name: "System Design", value: 55, color: "#8b5cf6" },
  { name: "Coding", value: 84, color: "#06b6d4" },
  { name: "Communication", value: 68, color: "#10b981" },
];

const SCORE_DATA = [
  { role: "Frontend Dev", score: 72 },
  { role: "Backend Dev", score: 65 },
  { role: "Full Stack", score: 80 },
  { role: "System Design", score: 58 },
  { role: "DevOps", score: 75 },
];

const PROGRESS_DATA = [
  { week: "Week 1", score: 52 },
  { week: "Week 2", score: 61 },
  { week: "Week 3", score: 68 },
  { week: "Week 4", score: 74 },
  { week: "Week 5", score: 80 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm shadow-lg">
        <p className="text-slate-300 font-medium">{label}</p>
        <p className="text-indigo-400 font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold font-mono text-xs">AI</span>
            </div>
            <span className="font-bold text-white">INTERVIEW COACH</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</a>
            <a href="/dashboard/history" className="text-slate-400 hover:text-white">History</a>
            <a href="/dashboard/profile" className="text-slate-400 hover:text-white">Profile</a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            Performance Analytics
          </h1>
          <p className="text-slate-400 mt-1">
            Visualize your skill strengths, scores, and progress over time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Skill Strength Distribution
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Breakdown of your competencies
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={SKILL_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {SKILL_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm">
                        <p className="text-slate-300">{payload[0].name}</p>
                        <p className="text-indigo-400 font-bold">{payload[0].value}%</p>
                      </div>
                    ) : null
                  }
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-slate-400 text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Interview Scores by Role
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Your scores across different interview types
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={SCORE_DATA} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="role"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
                <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Score Progress Over Time
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Track your improvement week-over-week
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={PROGRESS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="week"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[40, 100]}
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "#1e1b4b" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
