"use client";

import { useState, useRef, useEffect } from "react";
import { uploadResume, getInterviewHistory } from "@/services/api";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  CheckCircle,
  Loader2,
  Play,
  History,
  LogOut,
  BarChart3,
  User,
  TrendingUp,
  Trophy,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
type ParsedResume = {
  skills?: string[];
  projects?: string[];
};
type Interview = {
  interview_id: number;
  role_title?: string;
  score?: number;
  date: string;
};

function StatCard({
  icon: Icon,
  label,
  value,
  color = "indigo",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center flex-shrink-0`}
      >
        <Icon className={`w-5 h-5 text-${color}-400`} />
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [role, setRole] = useState("Software Engineer");
  const [starting, setStarting] = useState(false);

  const [history, setHistory] = useState<Interview[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      router.replace("/login");
      return;
    }

    const parsedUserId = parseInt(userId, 10);

    getInterviewHistory(parsedUserId)
      .then((data) => {
        if (Array.isArray(data)) {
          setHistory(data);
        }
      })
      .catch(() => {
        // If API fails, token might be invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        router.replace("/login");
      })
      .finally(() => {
        setStatsLoading(false);
        setCheckingAuth(false);
      });
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
      </div>
    );
  }

  const totalInterviews = history.length;
  const avgScore = totalInterviews
    ? Math.round(history.reduce((acc, h) => acc + (h.score || 0), 0) / totalInterviews)
    : 0;

  const lastScore = history.length > 0 ? history[0].score : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || uploading) return;

    setError(null);
    setUploading(true);

    try {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        router.replace("/login");
        return;
      }

      const res = await uploadResume(parseInt(userId), file);
      setParsedData(res.parsed_data);

    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Failed to upload resume");
  }
} finally {
      setUploading(false);
    }
  };

  // const handleStartInterview = () => {
  //   try {
  //     localStorage.setItem("selected_role", role);
  //     router.push("/interview/setup");
  //   } catch (err: any) {
  //     setError(err.message || "Failed to start interview");
  //   }
  // };
  const handleStartInterview = () => {
  try {
    if (!role) {
      setError("Please enter a role before starting.");
      return;
    }

    localStorage.setItem("selected_role", role);
    router.push("/interview/setup");

  } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Failed to start interview");
  }
}
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold font-mono text-xs">AI</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">INTERVIEW COACH</span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Link href="/dashboard/history" className="text-slate-400 hover:text-white flex items-center gap-1.5">
                <History className="w-4 h-4" /> History
              </Link>

              <Link href="/dashboard/analytics" className="text-slate-400 hover:text-white flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" /> Analytics
              </Link>

              <Link href="/dashboard/profile" className="text-slate-400 hover:text-white flex items-center gap-1.5">
                <User className="w-4 h-4" /> Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white flex items-center gap-1.5 border border-slate-700 rounded-lg px-3 py-1.5"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statsLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 animate-pulse h-20" />
            ))
          ) : (
            <>
              <StatCard icon={Trophy} label="Total Interviews" value={totalInterviews} color="indigo" />
              <StatCard icon={TrendingUp} label="Average Score" value={totalInterviews ? `${avgScore}/100` : "—"} color="purple" />
              <StatCard icon={BarChart3} label="Last Interview" value={lastScore != null ? `${lastScore}/100` : "—"} color="emerald" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Action Area */}
          <div className="lg:col-span-2 space-y-8">

            {/* Start Interview Card */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
              <h2 className="text-2xl font-bold text-white mb-2">Ready for your next challenge?</h2>
              <p className="text-slate-400 mb-6">Start a dynamic, AI-driven mock interview tailored to your experience and uploaded resume.</p>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                    placeholder="e.g. Frontend React Developer"
                  />
                </div>
                <div className="sm:self-end">
                  <button
                    onClick={handleStartInterview}
                    disabled={starting}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                    Start Interview
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {/* Resume Upload Card */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" /> Resume Context
              </h3>

              {!parsedData ? (
                <div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/50 rounded-xl p-8 text-center cursor-pointer transition-colors group"
                  >
                    <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-indigo-400 mx-auto mb-3 transition-colors" />
                    <p className="text-slate-300 font-medium mb-1">
                      {file ? file.name : "Click to upload your resume (PDF)"}
                    </p>
                    <p className="text-slate-500 text-sm mb-4">
                      Uploading your resume helps the AI tailor questions specifically to your background.
                    </p>
                    {file && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                        disabled={uploading}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                      >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Process Resume"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">Resume parsed! Questions will be tailored to your profile.</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Identified Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills?.map((skill: string, index: number) => (
                        <span key={index} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {parsedData?.projects && parsedData.projects.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Experience & Projects</h4>
                      <ul className="space-y-2">
                        {parsedData.projects.map((project: string, index: number) => (
                          <li key={index} className="text-sm text-slate-300 bg-slate-800/50 p-2 rounded-md border border-slate-700/50">
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Quick Links */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-base font-semibold text-white mb-4">Quick Navigation</h3>
              <div className="space-y-2">
                {[
                  { href: "/dashboard/history", icon: History, label: "Interview History", color: "text-indigo-400" },
                  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics Dashboard", color: "text-purple-400" },
                  { href: "/dashboard/profile", icon: User, label: "My Profile", color: "text-emerald-400" },
                ].map(({ href, icon: Icon, label, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between bg-slate-950/50 border border-slate-800 rounded-xl p-3 hover:border-slate-600 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white">{label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent History */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" /> Recent Interviews
              </h3>

              <div className="space-y-3">
                {statsLoading ? (
                  [1, 2].map((i) => (
                    <div key={i} className="h-14 bg-slate-800/50 rounded-lg animate-pulse" />
                  ))
                ) : history.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No interviews yet. Start one above!</p>
                ) : (
                  history.slice(0, 3).map((item) => (
                    <div
                      key={item.interview_id}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-3 hover:border-slate-600 transition-colors"
                    >
                      <p className="font-medium text-slate-200 text-sm">{item.role_title || "Interview"}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-slate-500">
                          {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                        {item.score != null && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.score >= 75
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            }`}>
                            {item.score}/100
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}

                <Link
                  href="/dashboard/history"
                  className="flex items-center justify-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 font-medium py-2 mt-1"
                >
                  View Full History <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
