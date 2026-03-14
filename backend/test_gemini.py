import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_KEY = os.getenv("AIzaSyAPhghk3aEbCjMNGQr_jFCpEqrx8t9I8Js")

print("API KEY:", API_KEY)  # Debug

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

data = {
    "contents": [
        {
            "parts": [
                {"text": "Give me 3 Java interview questions"}
            ]
        }
    ]
}

response = requests.post(url, json=data)

print(response.json())