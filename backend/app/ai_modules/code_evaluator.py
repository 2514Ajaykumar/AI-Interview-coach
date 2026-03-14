import json
from groq import Groq


class CodeEvaluator:

    def __init__(self):
        self.client = Groq(api_key="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")

    def evaluate(self, language, question, code):

        prompt = f"""
You are a senior software engineer interviewer.

Language: {language}

Question:
{question}

Candidate Code:
{code}

Evaluate the code and return ONLY valid JSON.

Format:

{{
  "score": number (0-100),
  "correctness": "...",
  "time_complexity": "...",
  "code_quality": "...",
  "edge_cases": "...",
  "suggestions": ["...", "..."]
}}
"""

        response = self.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )

        content = response.choices[0].message.content.strip()

        try:
            result = json.loads(content)
        except:
            result = {
                "score": 70,
                "correctness": "Evaluation parsing failed",
                "time_complexity": "Unknown",
                "code_quality": "Average",
                "edge_cases": "Not analyzed",
                "suggestions": ["Try improving code readability"]
            }

        return result