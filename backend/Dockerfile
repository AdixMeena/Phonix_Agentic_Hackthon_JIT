FROM python:3.12-slim

# Install system dependencies for MediaPipe and OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libstdc++6 \
    libgomp1 \
    libusb-1.0-0 \
    libfontconfig1 \
    mesa-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Upgrade pip and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Start command (Railway will override this if railway.toml is used)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
