"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  FileText,
  Mic,
  Code2,
  BarChart3,
  Upload,
  Play,
  Star,
  ChevronRight,
  CheckCircle,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleStartInterview = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* ─────────── NAV ─────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                INTERVIEWAI
              </span>
            </div>
            {/* Nav Links */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ─────────── HERO ─────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Gradient background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-20 -right-40 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 text-sm text-indigo-300 mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Interview Preparation
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            AI Interview{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Coach
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice interviews with AI and improve your skills. Get real-time
            feedback, voice-guided questions, and detailed analytics to land
            your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartInterview}
              className="group bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Interview
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="/signup"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              Sign Up Free
            </Link>
          </div>
          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <span>2,000+ interviews completed</span>
          </div>
        </div>
      </section>

      {/* ─────────── FEATURES ─────────── */}
      <section className="py-24 px-4 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to{" "}
              <span className="text-indigo-400">ace your interview</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              A complete toolkit for modern interview preparation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "Resume-Based Questions",
                desc: "AI generates questions tailored to your specific experience and skills.",
                color: "indigo",
              },
              {
                icon: Mic,
                title: "AI Interview Simulation",
                desc: "Voice-guided questions make it feel like a real interview experience.",
                color: "purple",
              },
              {
                icon: Code2,
                title: "Coding Practice",
                desc: "Monaco editor auto-activates for coding questions. Write real code.",
                color: "cyan",
              },
              {
                icon: BarChart3,
                title: "Performance Analytics",
                desc: "Detailed charts and insights on your skill strengths and progress.",
                color: "emerald",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all hover:-translate-y-1 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 text-lg">
              Get started in minutes, not hours.
            </p>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/60 via-purple-500/40 to-transparent hidden sm:block" />
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  icon: Upload,
                  title: "Upload Resume",
                  desc: "Upload your PDF resume. Our AI parses your skills, projects, and experience to generate personalized interview questions.",
                },
                {
                  step: "02",
                  icon: Play,
                  title: "Start Interview",
                  desc: "Choose your target role and AI will voice-read each question. Answer via text or switch to the code editor automatically.",
                },
                {
                  step: "03",
                  icon: TrendingUp,
                  title: "Get Feedback",
                  desc: "Receive instant evaluation with a score, detailed feedback, and improvement tips. Track your progress over time.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start sm:ml-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center z-10 relative">
                      <item.icon className="w-7 h-7 text-indigo-400" />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {item.step}
                    </span>
                  </div>
                  <div className="pt-3">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 rounded-3xl" />
            <Shield className="w-12 h-12 text-indigo-400 mx-auto mb-4 relative" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative">
              Start Practicing Now
            </h2>
            <p className="text-slate-400 text-lg mb-8 relative max-w-xl mx-auto">
              Join thousands of candidates who improved their interview skills
              with AI-powered coaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <button
                onClick={handleStartInterview}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Practicing Free
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
              {["No credit card required", "Free to start", "Cancel anytime"].map(
                (t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {t}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="border-t border-slate-800 py-8 px-4 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-400">INTERVIEWAI</span>
        </div>
        <p>© 2026 InterviewAI. Practice smarter, interview better.</p>
      </footer>
    </div>
  );
}
