"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/api";

export default function AdminLogin() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        setLoading(true);

        try {

            const response = await login({ email, password });

            // check admin role
            if (response?.role === "admin") {

                localStorage.setItem("token", response.token);
                localStorage.setItem("user_id", response.user_id.toString());
                localStorage.setItem("role", "admin");

                router.replace("/admin/dashboard");

            } else {

                setError("This account is not an admin account");

            }

        } catch (err: any) {

            setError(err.message || "Login failed");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">

            <form
                onSubmit={handleSubmit}
                className="bg-slate-900 p-10 rounded-xl border border-slate-800 w-96"
            >

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Admin Login
                </h1>

                {error && (
                    <p className="text-red-400 mb-4 text-sm text-center">
                        {error}
                    </p>
                )}

                <input
                    type="email"
                    required
                    placeholder="Email"
                    className="w-full p-3 mb-4 bg-slate-800 rounded outline-none focus:ring-2 focus:ring-purple-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    required
                    placeholder="Password"
                    className="w-full p-3 mb-6 bg-slate-800 rounded outline-none focus:ring-2 focus:ring-purple-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

        </div>
    );
}