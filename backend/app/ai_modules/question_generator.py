from groq import Groq


class QuestionGenerator:

    def __init__(self):

        self.client = Groq(
            api_key="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"
        )

    def generate_first_question(self, role, resume_context):

        skills = resume_context.get("skills", [])
        projects = resume_context.get("projects", [])

        prompt = f"""
You are a friendly technical interviewer.

Start an interview for a {role} position.

Candidate skills: {skills}
Candidate projects: {projects}

Ask the first greeting question asking the candidate to introduce themselves.
Return only the question.
"""

        response = self.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content

    def generate_followup_question(self, previous_question, answer, history):

        prompt = f"""
You are a senior technical interviewer.

Conversation history:
{history}

Previous Question:
{previous_question}

Candidate Answer:
{answer}

Ask the next logical follow-up question.
Return only the question.
"""

        response = self.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content