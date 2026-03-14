"use client";

import { useRouter } from "next/navigation";

export default function LoginSelector() {

    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">

            <div className="bg-slate-900 border border-slate-800 p-10 rounded-xl text-center">

                <h1 className="text-3xl font-bold mb-8">
                    Login As
                </h1>

                <div className="flex gap-6">

                    <button
                        onClick={() => router.push("/user-login")}
                        className="bg-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-700"
                    >
                        User
                    </button>

                    <button
                        onClick={() => router.push("/admin/login")}
                        className="bg-purple-600 px-8 py-3 rounded-lg hover:bg-purple-700"
                    >
                        Admin
                    </button>

                </div>

            </div>

        </div>
    );
}