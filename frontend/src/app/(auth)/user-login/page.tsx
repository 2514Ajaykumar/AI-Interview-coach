"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/api";
import Link from "next/link";
import { Bot, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prevent logged-in users from opening login page
  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {

      if (role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }

    }

  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError(null);
    setLoading(true);

    try {

      const response = await login({ email, password });

      console.log(response);

      if (response?.token) {

        // Clear any old session data safely
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("role");

        // Store new login session
        localStorage.setItem("token", response.token);
        localStorage.setItem("user_id", response.user_id.toString());
        localStorage.setItem("role", response.role);

        // Redirect based on role
        if (response.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/dashboard");
        }

        router.refresh();

      } else {

        setError("Invalid email or password.");

      }

    } catch (err) {

      console.error("Login error:", err);
      setError("Server error. Please try again.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 text-slate-200">

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">

        <div className="flex justify-center mb-6">

          <div className="h-14 w-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">

            <Bot className="h-8 w-8 text-white" />

          </div>

        </div>

        <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">

          Welcome back

        </h2>

        <p className="mt-2 text-sm text-slate-400">

          Sign in to your INTERVIEWAI account

        </p>

      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">

        <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-[0_0_40px_-15px_rgba(79,70,229,0.3)] sm:rounded-2xl sm:px-10 border border-slate-800">

          <form className="space-y-6" onSubmit={handleSubmit}>

            {error && (

              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">

                {error}

              </div>

            )}

            <div>

              <label className="block text-sm font-medium text-slate-300">

                Email address

              </label>

              <div className="mt-1 relative rounded-md shadow-sm">

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                  <Mail className="h-5 w-5 text-slate-500" />

                </div>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm rounded-lg py-2.5 transition-colors"
                  placeholder="you@example.com"
                />

              </div>

            </div>

            <div>

              <label className="block text-sm font-medium text-slate-300">

                Password

              </label>

              <div className="mt-1 relative rounded-md shadow-sm">

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                  <Lock className="h-5 w-5 text-slate-500" />

                </div>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm rounded-lg py-2.5 transition-colors"
                  placeholder="••••••••"
                />

              </div>

            </div>

            <div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all disabled:opacity-70"
              >

                {loading ? (

                  <Loader2 className="h-5 w-5 animate-spin" />

                ) : (

                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>

                )}

              </button>

            </div>

          </form>

          <div className="mt-6 text-center text-sm text-slate-400">

            Don&apos;t have an account?{" "}

            <Link
              href="/signup"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >

              Sign up

            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}