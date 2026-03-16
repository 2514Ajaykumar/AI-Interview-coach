"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type StartInterviewResponse = {
  interview: {
    id: number;
    user_id: number;
    job_role_id: number;
    status: string;
    scheduled_at: string | null;
    created_at: string;
  };
  question: string;
  question_limit: number;
  difficulty: string;
};

export default function InterviewSetup() {
  const router = useRouter();
  const requestLock = useRef(false);

  const [role, setRole] = useState("Machine Learning Engineer");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [questionLimit, setQuestionLimit] = useState(10);

  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------- LOAD ROLE FROM DASHBOARD -------- */

  useEffect(() => {
    const storedRole = localStorage.getItem("selected_role");
    if (storedRole) setRole(storedRole);
  }, []);

  /* -------- START INTERVIEW -------- */

  const startInterview = async () => {

    if (requestLock.current) return;

    const trimmedRole = role.trim();

    if (!trimmedRole) {
      setError("Please enter a role.");
      return;
    }

    const storedUserId = localStorage.getItem("user_id");

    if (!storedUserId) {
      router.replace("/login");
      return;
    }

    const userId = Number(storedUserId);

    if (!userId || Number.isNaN(userId)) {
      setError("Invalid user session. Please login again.");
      router.replace("/login");
      return;
    }

    requestLock.current = true;
    setStarting(true);
    setError(null);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/interviews/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            user_id: userId,
            role_title: trimmedRole,
            experience_level: difficulty,
            difficulty: difficulty,
            question_limit: questionLimit
          })
        }
      );

      let data: StartInterviewResponse;

      try {
        data = await response.json();
      } catch {
        throw new Error("Server returned invalid response.");
      }

      if (!response.ok) {
        throw new Error((data as any)?.detail || "Failed to start interview");
      }

      /* -------- SAVE SESSION -------- */

      localStorage.setItem("current_interview", JSON.stringify(data));

      /* -------- GO TO INTERVIEW -------- */

      router.push("/interview");

    } catch (err) {

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to start interview");
      }

      requestLock.current = false;
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-xl w-96">

        <h1 className="text-xl mb-6 font-semibold">
          Interview Setup
        </h1>

        {/* ROLE */}

        <label className="block mb-2 text-sm text-slate-400">
          Role
        </label>

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-4 bg-slate-800 rounded border border-slate-700"
        />

        {/* DIFFICULTY */}

        <label className="block mb-2 text-sm text-slate-400">
          Difficulty
        </label>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-2 mb-4 bg-slate-800 rounded border border-slate-700"
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        {/* QUESTION COUNT */}

        <label className="block mb-2 text-sm text-slate-400">
          Number of Questions
        </label>

        <select
          value={questionLimit}
          onChange={(e) => setQuestionLimit(Number(e.target.value))}
          className="w-full p-2 mb-6 bg-slate-800 rounded border border-slate-700"
        >
          <option value={5}>5 Questions</option>
          <option value={10}>10 Questions</option>
          <option value={20}>20 Questions</option>
          <option value={30}>30 Questions</option>
        </select>

        {/* ERROR */}

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        {/* START BUTTON */}

        <button
          onClick={startInterview}
          disabled={starting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-medium flex items-center justify-center disabled:opacity-70"
        >
          {starting ? "Starting Interview..." : "Start Interview"}
        </button>

      </div>
    </div>
  );
}