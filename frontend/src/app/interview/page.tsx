"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitAnswer } from "@/services/api";
import {
  Bot,
  Send,
  Loader2,
  CheckCircle,
  Mic,
  MicOff
} from "lucide-react";

export default function InterviewWorkspace() {

  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  const [sessionData, setSessionData] = useState<any>(null);
  const [question, setQuestion] = useState<string | null>(null);

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);
  const [listening, setListening] = useState(false);

  const [questionCount, setQuestionCount] = useState(1);
  const [questionLimit, setQuestionLimit] = useState(10);

  /* ---------------- SPEAK FUNCTION ---------------- */

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.95;
    speech.pitch = 1;
    speech.lang = "en-US";

    speechSynthesis.cancel();
    speechSynthesis.speak(speech);
  };

  /* ---------------- SPEECH RECOGNITION ---------------- */

  useEffect(() => {

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {

      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setAnswer((prev) => prev + " " + transcript);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  /* ---------------- LOAD INTERVIEW SESSION ---------------- */

  useEffect(() => {

    const dataStr = localStorage.getItem("current_interview");

    if (!dataStr) {
      router.push("/dashboard");
      return;
    }

    const data = JSON.parse(dataStr);

    setSessionData(data);
    setQuestion(data.question);

    if (data.question_limit) {
      setQuestionLimit(data.question_limit);
    }

    speak(data.question);

    startWebcam();

    return () => stopWebcam();

  }, []);

  /* ---------------- WEBCAM ---------------- */

  const startWebcam = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      streamRef.current = stream;

    } catch {
      console.warn("Webcam permission denied");
    }

  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
  };

  /* ---------------- SUBMIT ANSWER ---------------- */

  const handleSubmit = async () => {

    if (!answer.trim()) return;

    setSubmitting(true);

    try {

      const result = await submitAnswer(
        sessionData.interview.id,
        0,
        answer
      );

      setFeedback(result);

    } catch {

      alert("Failed to submit answer");

    } finally {

      setSubmitting(false);

    }

  };

  /* ---------------- NEXT QUESTION ---------------- */

  const handleNextQuestion = async () => {

    setFeedback(null);

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/v1/interviews/next_question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            interview_id: sessionData.interview.id,
            question: question,
            answer: answer
          })
        }
      );

      const data = await res.json();

      /* -------- INTERVIEW COMPLETED -------- */

      if (data.completed) {

        try {

          // IMPORTANT: save final interview result
          await fetch(
            `http://127.0.0.1:8000/api/v1/interviews/${sessionData.interview.id}/complete`,
            { method: "POST" }
          );

        } catch (err) {
          console.warn("Failed to finalize interview");
        }

        stopWebcam();

        router.push(`/interview/report?id=${sessionData.interview.id}`);

        return;
      }

      /* -------- NEXT QUESTION -------- */

      setQuestion(data.question);
      setAnswer("");
      setQuestionCount(prev => prev + 1);

      speak(data.question);

    } catch {

      alert("Failed to get next question");

    }

  };

  /* ---------------- LOADING SCREEN ---------------- */

  if (!sessionData || !question) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
      </div>
    );

  }

  /* ---------------- UI ---------------- */

  return (

    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* LEFT PANEL */}

      <div className="w-1/3 border-r border-slate-800 p-6 flex flex-col">

        <div className="flex flex-col items-center mb-6">

          <Bot className="w-12 h-12 text-indigo-400" />

          <p className="text-xs mt-2 text-slate-400">
            AI Interviewer
          </p>

          <p className="text-xs text-indigo-400 mt-2">
            Question {questionCount} / {questionLimit}
          </p>

        </div>

        <div className="bg-slate-900 p-4 rounded-lg flex-1">

          <p className="text-lg leading-relaxed">
            {question}
          </p>

        </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          className="mt-4 rounded-lg"
        />

      </div>

      {/* RIGHT PANEL */}

      <div className="w-2/3 p-6 flex flex-col">

        {feedback ? (

          <div>

            <div className="bg-slate-900 p-6 rounded-lg">

              <h3 className="text-xl flex items-center gap-2">

                <CheckCircle className="text-green-400" />

                Evaluation

              </h3>

              <p className="text-4xl mt-2">
                {feedback.score}/100
              </p>

              <p className="mt-4">
                {feedback.feedback}
              </p>

            </div>

            <button
              onClick={handleNextQuestion}
              className="mt-6 bg-indigo-600 px-6 py-3 rounded-lg"
            >
              Next Question
            </button>

          </div>

        ) : (

          <>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-1 bg-slate-900 p-4 rounded-lg"
              placeholder="Type or speak your answer..."
            />

            <div className="flex gap-3 mt-4">

              {!listening ? (

                <button
                  onClick={startListening}
                  className="bg-slate-800 px-4 py-2 rounded-lg flex gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Speak
                </button>

              ) : (

                <button
                  onClick={stopListening}
                  className="bg-red-600 px-4 py-2 rounded-lg flex gap-2"
                >
                  <MicOff className="w-4 h-4" />
                  Stop
                </button>

              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-indigo-600 px-6 py-2 rounded-lg flex gap-2"
              >

                {submitting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}

                Submit

              </button>

            </div>

          </>

        )}

      </div>

    </div>

  );

}