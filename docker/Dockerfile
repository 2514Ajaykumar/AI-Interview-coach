# Use multi-stage builds if needed, this is a basic combined Dockerfile for backend

# Backend Build
FROM python:3.10-slim AS backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# (Frontend can be a separate Dockerfile or handled via Vercel/similar hosting)
