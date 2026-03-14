"use client";

import { useEffect, useState } from "react";
import { Users, BarChart3, Activity, Trophy } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

export default function AdminDashboard() {

    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [performance, setPerformance] = useState<any[]>([]);
    const [loginChart, setLoginChart] = useState<any[]>([]);
    const [interviewChart, setInterviewChart] = useState<any[]>([]);
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const usersRes = await fetch("http://127.0.0.1:8000/api/v1/admin/users");
                const usersData = await usersRes.json();
                setUsers(usersData.users);

                const statsRes = await fetch("http://127.0.0.1:8000/api/v1/admin/stats");
                const statsData = await statsRes.json();
                setStats(statsData);

                const perfRes = await fetch("http://127.0.0.1:8000/api/v1/admin/user-performance");
                const perfData = await perfRes.json();
                setPerformance(perfData.users || []);

                const loginRes = await fetch("http://127.0.0.1:8000/api/v1/admin/login-activity");
                const loginData = await loginRes.json();
                setLoginChart(loginData.activity || []);

                const interviewRes = await fetch("http://127.0.0.1:8000/api/v1/admin/interview-activity");
                const interviewData = await interviewRes.json();
                setInterviewChart(interviewData.activity || []);

                const leaderRes = await fetch("http://127.0.0.1:8000/api/v1/admin/leaderboard");
                const leaderData = await leaderRes.json();
                setLeaders(leaderData.leaders || []);

            } catch (err) {
                console.error("Admin dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }

        };

        fetchData();

    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                Loading Admin Dashboard...
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-slate-950 text-white p-10">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-10">

                <h1 className="text-3xl font-bold">
                    Admin Analytics Dashboard
                </h1>

                <a
                    href="http://127.0.0.1:8000/api/v1/admin/export-users"
                    className="bg-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-700"
                >
                    Download Users Report
                </a>

            </div>

            {/* STATS */}

            <div className="grid grid-cols-3 gap-6 mb-12">

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <Users className="mb-3 text-indigo-400" />
                    <p className="text-gray-400">Total Users</p>
                    <h2 className="text-3xl font-bold">
                        {stats?.total_users || 0}
                    </h2>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <BarChart3 className="mb-3 text-purple-400" />
                    <p className="text-gray-400">Total Interviews</p>
                    <h2 className="text-3xl font-bold">
                        {stats?.total_interviews || 0}
                    </h2>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <Activity className="mb-3 text-green-400" />
                    <p className="text-gray-400">Platform Status</p>
                    <h2 className="text-3xl font-bold">
                        Active
                    </h2>
                </div>

            </div>

            {/* CHARTS */}

            <div className="grid grid-cols-2 gap-10 mb-12">

                {/* USER REGISTRATION */}

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-6">
                        User Registration Activity
                    </h2>

                    <ResponsiveContainer width="100%" height={300}>

                        <LineChart data={loginChart}>

                            <CartesianGrid stroke="#333" />

                            <XAxis dataKey="date" stroke="#aaa" />

                            <YAxis stroke="#aaa" />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#6366f1"
                                strokeWidth={3}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

                {/* INTERVIEW ACTIVITY */}

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-6">
                        Interview Activity
                    </h2>

                    <ResponsiveContainer width="100%" height={300}>

                        <LineChart data={interviewChart}>

                            <CartesianGrid stroke="#333" />

                            <XAxis dataKey="date" stroke="#aaa" />

                            <YAxis stroke="#aaa" />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="interviews"
                                stroke="#10b981"
                                strokeWidth={3}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* LEADERBOARD */}

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-12">

                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Trophy className="text-yellow-400" /> Top Performing Users
                </h2>

                <ul>

                    {leaders.map((user, index) => (
                        <li
                            key={user.id}
                            className="flex justify-between border-b border-slate-800 py-3"
                        >

                            <span>
                                #{index + 1} {user.name}
                            </span>

                            <span className="text-green-400">
                                {user.best_score}
                            </span>

                        </li>
                    ))}

                </ul>

            </div>

            {/* USER PERFORMANCE TABLE */}

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

                <h2 className="text-xl font-semibold mb-6">
                    User Performance
                </h2>

                <table className="w-full">

                    <thead className="border-b border-slate-700">
                        <tr>
                            <th className="text-left p-3">User</th>
                            <th className="text-left p-3">Interviews</th>
                            <th className="text-left p-3">Avg Score</th>
                            <th className="text-left p-3">Best Score</th>
                        </tr>
                    </thead>

                    <tbody>

                        {performance.map((user) => (

                            <tr
                                key={user.id}
                                className="border-b border-slate-800 hover:bg-slate-800"
                            >

                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.interviews_taken || 0}</td>
                                <td className="p-3">
                                    {user.avg_score ? Math.round(user.avg_score) : 0}
                                </td>
                                <td className="p-3">{user.best_score || 0}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
}