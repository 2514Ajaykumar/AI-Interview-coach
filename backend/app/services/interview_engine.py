from app.ai_modules.question_generator import QuestionGenerator
from app.database import repository


class InterviewOrchestrator:

    def __init__(self):
        self.generator = QuestionGenerator()

        # Session memory
        self.history = {}

        # Interview configuration
        self.question_limits = {}
        self.question_counts = {}
        self.difficulty_levels = {}

    # ---------------- START INTERVIEW ---------------- #

    def start_interview_session(self, user_id: int, role_title: str,
                                difficulty: str = "Beginner",
                                question_limit: int = 10):

        role = repository.get_job_role_by_title(role_title)

        if not role:
            role = repository.create_job_role(role_title)

        # role_id = role["id"]
        role_id = role["id"] if isinstance(role, dict) else role.id
        interview = repository.create_interview(user_id, role_id)

        resumes = repository.get_resumes_by_user(user_id)

        resume_context = {}

        if resumes:
            # latest_resume = resumes[0]

            # resume_context = {
            #     "skills": latest_resume.get("parsed_skills", []),
            #     "projects": latest_resume.get("parsed_projects", [])
            # }
            latest_resume = resumes[0]

        if isinstance(latest_resume, dict):
            resume_context = {
                "skills": latest_resume.get("parsed_skills", []),
                "projects": latest_resume.get("parsed_projects", [])
            }
        else:
            resume_context = {
                "skills": getattr(latest_resume, "parsed_skills", []),
                "projects": getattr(latest_resume, "parsed_projects", [])
            }

        question = self.generator.generate_first_question(
            role_title,
            resume_context
        )

        # interview_id = interview.id
        interview_id = interview["id"] if isinstance(interview, dict) else interview.id

        # Session state
        self.history[interview_id] = []
        self.question_limits[interview_id] = question_limit
        self.question_counts[interview_id] = 1
        self.difficulty_levels[interview_id] = difficulty

        return {
            "interview": interview,
            "question": question,
            "question_limit": question_limit,
            "difficulty": difficulty
        }
    # def start_interview_session(self, user_id: int, role_title: str,
    #                         difficulty: str = "Beginner",
    #                         question_limit: int = 10):

    #     role = repository.get_job_role_by_title(role_title)

    #     if not role:
    #         role = repository.create_job_role(role_title)

    #     role_id = role["id"] if isinstance(role, dict) else role.id

    #     interview = repository.create_interview(user_id, role_id)

    #     if isinstance(interview, dict):
    #         interview_id = interview.get("id")
    #     else:
    #         interview_id = interview.id

    #     resumes = repository.get_resumes_by_user(user_id)

    #     resume_context = {}

    #     if resumes:
    #         latest_resume = resumes[0]

    #     resume_context = {
    #         "skills": latest_resume.get("parsed_skills", []),
    #         "projects": latest_resume.get("parsed_projects", [])
    #     }

    #     question = self.generator.generate_first_question(
    #         role_title,
    #         resume_context
    #     )

    #     # Session state
    #     self.history[interview_id] = []
    #     self.question_limits[interview_id] = question_limit
    #     self.question_counts[interview_id] = 1
    #     self.difficulty_levels[interview_id] = difficulty

    #     return {
    #         "interview": interview,
    #         "question": question,
    #         "question_limit": question_limit,
    #         "difficulty": difficulty
    #     }

    # ---------------- NEXT QUESTION ---------------- #

    def next_question(self, interview_id, previous_question, answer):

        if interview_id not in self.history:
            self.history[interview_id] = []

        # Save conversation
        self.history[interview_id].append({
            "question": previous_question,
            "answer": answer
        })

        # Increment question count
        if interview_id in self.question_counts:
            self.question_counts[interview_id] += 1

        # ---------------- ADAPTIVE DIFFICULTY ---------------- #

        difficulty = self.difficulty_levels.get(interview_id, "Beginner")

        answer_length = len(answer)

        if answer_length > 200:
            difficulty = "Advanced"
        elif answer_length > 80:
            difficulty = "Intermediate"
        else:
            difficulty = "Beginner"

        self.difficulty_levels[interview_id] = difficulty

        # ---------------- CHECK QUESTION LIMIT ---------------- #

        if interview_id in self.question_limits:
            if self.question_counts[interview_id] > self.question_limits[interview_id]:

                return {
                    "completed": True,
                    "message": "Interview completed"
                }

        # ---------------- GENERATE NEXT QUESTION ---------------- #

        question = self.generator.generate_followup_question(
            previous_question,
            answer,
            self.history[interview_id]
        )

        return {
            "question": question,
            "difficulty": difficulty,
            "completed": False
        }

    # ---------------- ANSWER EVALUATION ---------------- #

    def evaluate_answer(self, interview_id: int, question_id: int, answer_text: str):

        score = 0

        length = len(answer_text)

        # Better scoring logic
        if length > 50:
            score += 30

        if length > 120:
            score += 30

        if length > 250:
            score += 20

        if length > 400:
            score += 20

        score = min(score, 100)

        # Feedback
        if score >= 80:
            feedback = "Excellent answer with strong explanation."
        elif score >= 60:
            feedback = "Good answer but you can improve depth."
        elif score >= 40:
            feedback = "Decent answer but missing technical details."
        else:
            feedback = "Try to explain with examples and clearer structure."

        try:

            # Prevent foreign key crash
            if not question_id or question_id == 0:
                question_id = None

            repository.save_answer(
                interview_id,
                question_id,
                answer_text,
                score,
                feedback
            )

        except Exception as e:
            print("Database save skipped:", e)

        return {
            "score": score,
            "feedback": feedback,
            "passed": score >= 60
        }

    # ---------------- COMPLETE INTERVIEW ---------------- #

    def complete_session(self, interview_id: int):

        try:

            report = repository.get_interview_report(interview_id)

            if not report:
                repository.complete_interview(interview_id, 0)

                return {
                    "interview_id": interview_id,
                    "total_score": 0
                }

            answers = report.get("answers", [])

            if answers and len(answers) > 0:
                total_score = sum(a["score"] for a in answers) // len(answers)
            else:
                total_score = 0

            repository.complete_interview(interview_id, total_score)

            # Clear session memory
            self.history.pop(interview_id, None)
            self.question_counts.pop(interview_id, None)
            self.question_limits.pop(interview_id, None)
            self.difficulty_levels.pop(interview_id, None)

            return {
                "interview_id": interview_id,
                "total_score": total_score
            }

        except Exception as e:

            print("Complete session error:", e)

            repository.complete_interview(interview_id, 0)

            return {
                "interview_id": interview_id,
                "total_score": 0
            }