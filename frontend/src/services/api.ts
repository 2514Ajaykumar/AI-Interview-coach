import { config } from "./config";

// ----------------------------------------------------------------------
// Base API execution
// ----------------------------------------------------------------------
export const fetchAPI = async (
  endpoint: string,
  options: RequestInit = {},
  isFormData: boolean = false
) => {

  const url = `${config.API_URL}${endpoint}`;

  let token: string | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 🔥 Handle expired or invalid token
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");

      // Redirect to login
      window.location.href = "/login";
    }

    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {

    let errorDetail = "Unknown error";

    try {
      const errBody = await response.json();

      if (typeof errBody === "string") {
        errorDetail = errBody;
      } else if (errBody.detail) {
        errorDetail = errBody.detail;
      } else if (errBody.message) {
        errorDetail = errBody.message;
      } else {
        errorDetail = JSON.stringify(errBody);
      }

    } catch {
      errorDetail = response.statusText;
    }

    throw new Error(errorDetail);
  }

  return response.json();
};

// ----------------------------------------------------------------------
// Auth Services
// ----------------------------------------------------------------------
export const login = async (data: { email: string; password: string }) => {
  return fetchAPI("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });
};

export const signup = async (data: { name?: string; email: string; password: string }) => {

  return fetchAPI("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

};

export const logout = () => {

  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }

};

// ----------------------------------------------------------------------
// Resume Services
// ----------------------------------------------------------------------
export const uploadResume = async (userId: number, file: File) => {

  const formData = new FormData();

  formData.append("user_id", userId.toString());
  formData.append("file", file);

  return fetchAPI(
    "/api/v1/resumes/upload",
    {
      method: "POST",
      body: formData,
    },
    true
  );

};

// ----------------------------------------------------------------------
// Interview Services
// ----------------------------------------------------------------------
export const startInterview = async (
  userId: number,
  roleTitle: string,
  experienceLevel: string = "Beginner"
) => {

  return fetchAPI("/api/v1/interviews/start", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      role_title: roleTitle,
      experience_level: experienceLevel,
    }),
  });

};

export const submitAnswer = async (
  interviewId: number,
  questionId: number,
  answerText: string
) => {

  return fetchAPI("/api/v1/interviews/submit_answer", {
    method: "POST",
    body: JSON.stringify({
      interview_id: interviewId,
      question_id: questionId,
      answer_text: answerText,
    }),
  });

};

export const completeInterview = async (interviewId: number) => {
  return fetchAPI(`/api/v1/interviews/${interviewId}/complete`, {
    method: "POST",
  });
};

export const getInterviewReport = async (interviewId: number) => {
  return fetchAPI(`/api/v1/interviews/${interviewId}/report`, {
    method: "GET",
  });
};

export const getInterviewHistory = async (userId: number) => {
  return fetchAPI(`/api/v1/interviews/history/${userId}`, {
    method: "GET",
  });
};
