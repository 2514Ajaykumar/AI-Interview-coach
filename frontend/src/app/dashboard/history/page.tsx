"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getInterviewHistory } from "@/services/api";
import { History, ArrowRight, Loader2, Trophy } from "lucide-react";
import Link from "next/link";

interface HistoryItem {
  interview_id: number;
  role_title: string;
  date: string;
  score: number | null;
  questions_count: number;
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
        N/A
      </span>
    );
  }
  const color =
    score >= 75
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : score >= 50
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      : "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
      {score}/100
    </span>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    const userId = parseInt(localStorage.getItem("user_id") || "1", 10);
    getInterviewHistory(userId)
      .then((data) => {
        if (Array.isArray(data)) setHistory(data);
        else setHistory([]);
      })
      .catch((err) => setError(err.message || "Failed to load history"))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold font-mono text-xs">AI</span>
            </div>
            <span className="font-bold text-white">INTERVIEW COACH</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</a>
            <a href="/dashboard/profile" className="text-slate-400 hover:text-white transition-colors">Profile</a>
            <a href="/dashboard/analytics" className="text-slate-400 hover:text-white transition-colors">Analytics</a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <History className="w-7 h-7 text-indigo-400" />
              Interview History
            </h1>
            <p className="text-slate-400 mt-1">
              All your completed mock interviews in one place.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            New Interview <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-400">{error}</div>
        ) : history.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium text-slate-400">No interviews yet</p>
            <p className="mt-2">Complete an interview to see your history here.</p>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="text-left text-sm font-medium text-slate-400 py-4 px-6">Role</th>
                  <th className="text-left text-sm font-medium text-slate-400 py-4 px-4">Date</th>
                  <th className="text-center text-sm font-medium text-slate-400 py-4 px-4">Questions</th>
                  <th className="text-center text-sm font-medium text-slate-400 py-4 px-4">Score</th>
                  <th className="text-center text-sm font-medium text-slate-400 py-4 px-6">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.map((item) => (
                  <tr
                    key={item.interview_id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-white">
                      {item.role_title || "General Interview"}
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-sm">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-300">
                      {item.questions_count}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <ScoreBadge score={item.score} />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/interview/report?id=${item.interview_id}`}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center justify-center gap-1"
                      >
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
