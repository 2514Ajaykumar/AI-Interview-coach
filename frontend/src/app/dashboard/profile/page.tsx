"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadResume } from "@/services/api";
import {
  User,
  Mail,
  BarChart3,
  FileText,
  UploadCloud,
  CheckCircle,
  Loader2,
  TrendingUp,
  Calendar,
} from "lucide-react";

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
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center flex-shrink-0`}
      >
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const storedEmail = localStorage.getItem("email") || "user@example.com";
    const storedUserId = parseInt(localStorage.getItem("user_id") || "1", 10);
    setEmail(storedEmail);
    setUserId(storedUserId);

    // Load history for stats
    fetch(`http://localhost:8000/api/v1/interviews/history/${storedUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setHistory(data);
      })
      .catch(() => {});
  }, [router]);

  const avgScore = history.length
    ? Math.round(history.reduce((acc, h) => acc + (h.score || 0), 0) / history.length)
    : 0;

  const lastScore =
    history.length > 0 ? history[0].score ?? "—" : "—";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !userId) return;
    setError(null);
    setUploading(true);
    try {
      await uploadResume(userId, file);
      setUploadSuccess(true);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold font-mono text-xs">AI</span>
            </div>
            <span className="font-bold text-white">INTERVIEW COACH</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</a>
            <a href="/dashboard/history" className="text-slate-400 hover:text-white transition-colors">History</a>
            <a href="/dashboard/analytics" className="text-slate-400 hover:text-white transition-colors">Analytics</a>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {email.split("@")[0]}
            </h2>
            <div className="flex items-center gap-2 text-slate-400 mt-1">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 mt-1 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Member since 2026</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={BarChart3} label="Total Interviews" value={history.length} color="indigo" />
          <StatCard icon={TrendingUp} label="Average Score" value={avgScore ? `${avgScore}/100` : "—"} color="purple" />
          <StatCard icon={FileText} label="Last Interview Score" value={lastScore !== "—" ? `${lastScore}/100` : "—"} color="emerald" />
        </div>

        {/* Resume Uploader */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Upload / Update Resume
          </h3>

          {uploadSuccess ? (
            <div className="flex items-center gap-3 bg-emerald-400/10 border border-emerald-400/20 p-4 rounded-xl text-emerald-400">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Resume uploaded successfully! AI will use it for your next interview.</span>
            </div>
          ) : (
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/50 rounded-xl p-8 text-center cursor-pointer transition-colors group"
              >
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-indigo-400 mx-auto mb-3 transition-colors" />
                <p className="text-slate-300 font-medium mb-1">
                  {file ? file.name : "Click to upload your resume (PDF)"}
                </p>
                <p className="text-slate-500 text-sm">PDF files up to 10MB</p>
              </div>

              {file && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  {uploading ? "Uploading..." : "Upload Resume"}
                </button>
              )}

              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
