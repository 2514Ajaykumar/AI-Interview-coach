"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getInterviewReport } from "@/services/api";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Loader2,
  Home,
  BarChart3,
} from "lucide-react";

function deriveFeedbackAnalysis(answers: any[]) {
  if (!answers || answers.length === 0) {
    return {
      strengths: ["Showed up and attempted the interview"],
      weaknesses: ["More practice needed across all areas"],
      tips: ["Start with the basics and practice regularly"],
      radarData: [],
    };
  }

  const avgScore =
    answers.reduce((acc, a) => acc + (a.score || 0), 0) / answers.length;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const tips: string[] = [];

  if (avgScore >= 70) {
    strengths.push("Strong detailed explanations in most answers");
    strengths.push("Demonstrated clear understanding of concepts");
  } else if (avgScore >= 50) {
    strengths.push("Good grasp of core concepts");
    weaknesses.push("Answers lacked depth in complex areas");
    tips.push("Try to elaborate more with real-world examples");
  } else {
    weaknesses.push("Answers were too brief and lacked detail");
    weaknesses.push("Depth of knowledge needs improvement");
    tips.push("Practice answering STAR-format questions");
    tips.push("Study the fundamentals of your target role");
  }

  if (strengths.length === 0) strengths.push("Attempted all questions");
  if (tips.length === 0) tips.push("Keep practicing to maintain your high standard");

  const radarData = [
    { subject: "Technical Depth", value: Math.min(100, avgScore + 10) },
    { subject: "Communication", value: Math.min(100, avgScore + 5) },
    { subject: "Problem Solving", value: avgScore },
    { subject: "Clarity", value: Math.min(100, avgScore - 5) },
    { subject: "Completeness", value: Math.min(100, avgScore + 15) },
  ].map((d) => ({ ...d, value: Math.max(0, Math.round(d.value)) }));

  return { strengths, weaknesses, tips, radarData };
}

function ReportContent() {
  const router = useRouter();
  const params = useSearchParams();
  const interviewId = params.get("id");

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    if (!interviewId) {
      // fallback: try from localstorage current interview
      const storedInterview = localStorage.getItem("current_interview");
      if (storedInterview) {
        const parsed = JSON.parse(storedInterview);
        const id = parsed?.interview?.id;
        if (id) {
          getInterviewReport(id)
            .then(setReport)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
          return;
        }
      }
      setLoading(false);
      setError("No interview ID found.");
      return;
    }

    getInterviewReport(parseInt(interviewId))
      .then(setReport)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router, interviewId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const answers = report?.answers || [];
  const totalScore = report?.interview?.total_score ?? null;
  const { strengths, weaknesses, tips, radarData } =
    deriveFeedbackAnalysis(answers);

  const displayScore = totalScore !== null ? totalScore : answers.length > 0
    ? Math.round(answers.reduce((acc: number, a: any) => acc + (a.score || 0), 0) / answers.length)
    : 0;

  const scoreColor =
    displayScore >= 75
      ? "text-emerald-400"
      : displayScore >= 50
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <span className="text-white font-bold text-lg">Interview Report</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/analytics")}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error ? (
          <div className="text-center py-24 text-red-400">
            <p className="text-xl mb-4">⚠️ {error}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Score Hero */}
            <div className="text-center mb-10">
              <div className="inline-flex flex-col items-center bg-slate-900/60 border border-slate-800 rounded-3xl px-12 py-8">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
                  Final Score
                </p>
                <p className={`text-7xl font-extrabold ${scoreColor}`}>
                  {displayScore}
                </p>
                <p className="text-slate-500 mt-1">/100</p>
                <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-semibold border 
                  ${displayScore >= 75 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : 
                    displayScore >= 50 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" : 
                    "bg-red-500/10 text-red-400 border-red-500/30"}`}
                >
                  {displayScore >= 75 ? "Excellent Performance" : displayScore >= 50 ? "Good Performance" : "Needs Improvement"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Radar Chart */}
              {radarData.length > 0 && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Skill Breakdown</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#64748b", fontSize: 11 }}
                      />
                      <Tooltip
                        content={({ active, payload }) =>
                          active && payload?.length ? (
                            <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm">
                              <p className="text-slate-300">{payload[0].payload.subject}</p>
                              <p className="text-indigo-400 font-bold">{payload[0].value}</p>
                            </div>
                          ) : null
                        }
                      />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div className="space-y-4">
                <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-6">
                  <h3 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-900/60 border border-red-500/20 rounded-2xl p-6">
                  <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Areas to Improve
                  </h3>
                  <ul className="space-y-2">
                    {weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Improvement Tips */}
            <div className="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-6">
              <h3 className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Improvement Tips
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tips.map((tip, i) => (
                  <div
                    key={i}
                    className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-4 text-slate-300 text-sm leading-relaxed"
                  >
                    <span className="text-indigo-400 font-bold mr-2">#{i + 1}</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
