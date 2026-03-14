import os
import re
import pdfplumber

class ResumeParser:
    def __init__(self, provider: str = "static"):
        self.provider = provider
        
    def parse_pdf(self, file_path: str) -> str:
        """Extracts text from a given PDF file path securely."""
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
        return text

    def extract_information(self, text: str) -> dict:
        """
        Mock extraction layer finding keywords using Regex/static arrays.
        Will be replaced by an LLM parser later.
        """
        if self.provider == "static":
            # Very basic static mock parsing logic for structure
            text_lower = text.lower()
            
            # Simulated dummy logic
            skills_found = [s for s in ["python", "react", "sql", "java", "aws", "docker"] if s in text_lower]
            projects_found = ["InterviewAI"] if "interviewai" in text_lower else []
            experience_found = ["Software Engineer"] if "engineer" in text_lower else []

            return {
                "skills": skills_found if skills_found else ["Python", "General Software Engineering"],
                "experience": experience_found if experience_found else ["Entry Level / No specific experience parsed"],
                "projects": projects_found if projects_found else ["Unknown Project"],
                "technologies": skills_found  # Merged with skills for simplicity in this mock
            }
        
        return {
            "skills": [],
            "experience": [],
            "projects": [],
            "technologies": []
        }
