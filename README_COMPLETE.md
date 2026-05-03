# 🏥 Phoenix AI — Physiotherapy Rehabilitation, Reimagined

<div align="center">

![Phoenix AI Logo](https://img.shields.io/badge/Phoenix%20AI-v1.0.0-blue?style=for-the-badge)
![Full Stack](https://img.shields.io/badge/Full%20Stack-React%20%2B%20FastAPI%20%2B%20AI-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-Apache%202.0-orange?style=for-the-badge)

**An AI-Powered Doctor-Patient Collaboration Platform for Real-Time Exercise Form Correction**

[📖 Full Documentation](#-documentation) • [🚀 Quick Start](#-quick-start-local-setup) • [🛠️ Tech Stack](#-tech-stack) • [🤖 Features](#-features) • [🐛 Troubleshooting](#-troubleshooting)

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Prerequisites](#-prerequisites)
5. [Quick Start - Local Setup](#-quick-start-local-setup)
6. [Project Structure](#-project-structure)
7. [Running the Application](#-running-the-application)
8. [API Documentation](#-api-documentation)
9. [Database Setup](#-database-setup)
10. [Troubleshooting](#-troubleshooting)
11. [Deployment](#-deployment)
12. [Contributing](#-contributing)
13. [Documentation](#-documentation)

---

## 🎯 Overview

**Phoenix AI** is a comprehensive digital physiotherapy platform that combines:

- 🤖 **Real-Time AI Pose Detection** — Instant feedback on exercise form using MediaPipe
- 👨‍⚕️ **Doctor-Patient Collaboration** — Doctors assign exercises, monitor form, provide feedback
- 📊 **Advanced Analytics** — Joint angle tracking, form scoring (0-100), progress charts
- 🌍 **Multi-Language Support** — Voice feedback in 50+ languages via Edge TTS
- 🔐 **Clinical-Grade Security** — HIPAA-ready, RLS policies, encrypted data

**Perfect for:** Physical therapy clinics, rehabilitation centers, post-injury recovery, sports medicine

---

## ✨ Features

### 🩺 Doctor Dashboard
- 📋 **Patient Management** — Add, search, manage patient list
- 📊 **Analytics Dashboard** — View patient progress, scores, compliance
- 🎯 **Exercise Assignment** — Assign exercises with target reps/duration
- 💬 **Real-Time Feedback** — Record personalized messages for patients
- 📈 **Performance Tracking** — Historical data, trends, form improvement

### 👤 Patient Dashboard
- 🏠 **Home Screen** — Daily greeting, score streak, today's exercises
- 📹 **Camera Session** — Real-time pose detection with voice feedback
- 📊 **Score Breakdown** — Detailed joint analysis after each session
- 💌 **Doctor Feedback** — Messages from assigned physician
- 📱 **Mobile Responsive** — Works on tablets, phones, desktops

### 🤖 AI Features
- **4 Built-in Exercise Analyzers:**
  - 🦵 **Squats** — Depth, knee alignment, stance width
  - 🚶 **Lunges** — Balance, stride, torso angle
  - 🧘 **Warrior Pose** — Stability, hip alignment, hold time
  - 🦵 **Leg Raises** — Control, momentum detection

- **Real-Time Feedback:**
  - Joint angle monitoring (±5° accuracy)
  - Voice cues in patient's language
  - Visual skeleton overlay
  - Form error detection

- **Intelligent Scoring:**
  - 0-100 scale based on form quality
  - Joint-specific scoring
  - Rep count validation
  - Safety violation detection

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **React Router** | 6.22.0 | Navigation |
| **Vite** | 7.0.0 | Build tool |
| **Recharts** | 2.12.0 | Data visualization |
| **Supabase JS** | 2.104.1 | Auth & database |
| **Three.js / Vanta** | 0.184 / 0.5.24 | 3D backgrounds |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **FastAPI** | 0.111.0 | REST API |
| **Uvicorn** | 0.29.0 | ASGI server |
| **Supabase** | 2.4.3 | PostgreSQL + Auth |
| **WebSockets** | 12.0 | Real-time streaming |
| **OpenAI/Groq** | 1.30.1 | LLM integration |

### Computer Vision
| Technology | Version | Purpose |
|-----------|---------|---------|
| **MediaPipe** | 0.10.14 | Pose detection (33 landmarks) |
| **OpenCV** | 4.10.0.84 | Frame processing |
| **TensorFlow** | Latest | Custom ML models |
| **NumPy / Pandas** | Latest | Data processing |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Vercel** | Frontend hosting (auto-deploy) |
| **Railway** | Backend hosting (Docker) |
| **Supabase** | Database + authentication |
| **Docker** | Containerization |

---

## 📦 Prerequisites

### System Requirements
- **OS:** Windows, macOS, or Linux
- **Node.js:** 18.0.0+ ([Download](https://nodejs.org/))
- **Python:** 3.9+ ([Download](https://www.python.org/))
- **Git:** 2.0+ ([Download](https://git-scm.com/))

### Optional but Recommended
- **Docker & Docker Compose** — For backend containerization
- **PostgreSQL Client** — For database debugging (`psql`)
- **Postman** — For API testing

### Accounts Needed
1. **Supabase Account** (Free) — Database & Auth
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Copy `URL` and `Anon Key`

2. **OpenAI/Groq API Key** (Optional) — For AI feedback
   - Get from [groq.com](https://groq.com) or [openai.com](https://openai.com)

---

## 🚀 Quick Start — Local Setup

### Step 1️⃣: Clone the Repository

```bash
# Clone the project
git clone https://github.com/yourusername/phoenix-ai.git
cd phoenix-ai

# Create a Python virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```

### Step 2️⃣: Install Backend Dependencies

```bash
# Install root-level dependencies (includes backend)
pip install -r requirements.txt

# Install Backend_Vision dependencies
cd Backend_Vision
pip install -r requirements.txt
cd ..
```

### Step 3️⃣: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### Step 4️⃣: Environment Configuration

Create a `.env` file in the **root directory**:

```env
# ── Supabase Configuration ────────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# ── AI/LLM Configuration ──────────────────────────
GROQ_API_KEY=your-groq-api-key (optional)
OPENAI_API_KEY=your-openai-api-key (optional)

# ── Frontend Configuration ────────────────────────
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000

# ── Video Server Configuration ────────────────────
WEBSOCKET_HOST=localhost
WEBSOCKET_PORT=8001
WEBSOCKET_URL=ws://localhost:8001
```

> **📌 Note:** Get your Supabase keys from your project's Settings → API tab

---

## 🎬 Running the Application

### 🔥 Option A: Run All Services (Recommended for Development)

Open **3 separate terminal windows** in the project root:

#### Terminal 1: Backend (REST API) — Port 8000
```bash
# Activate virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Run FastAPI backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Started server process [1234]
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

#### Terminal 2: Backend Vision (WebSocket & AI) — Port 8001
```bash
# Activate virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Run Vision server
cd Backend_Vision
python main.py
```

**Expected Output:**
```
INFO:     Loaded analyzers: ['Squats', 'Lunges', 'Warrior', 'LegRaises', 'general']
INFO:     WebSocket server starting on ws://0.0.0.0:8001
```

#### Terminal 3: Frontend (React Dev Server) — Port 5173
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v7.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

**✅ Application is now running!**
- 🌐 Frontend: http://localhost:5173
- 🔌 REST API: http://localhost:8000/docs
- 📡 WebSocket: ws://localhost:8001

---

### 🐳 Option B: Run with Docker (Production-Like)

```bash
# Build backend image
docker build -f backend/Dockerfile -t phoenix-backend .

# Run backend container
docker run -p 8000:8000 -p 8001:8001 \
  -e SUPABASE_URL=$SUPABASE_URL \
  -e SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY \
  phoenix-backend

# In another terminal, run frontend
cd frontend
npm run dev
```

---

### 🔧 Option C: Manual Setup (Step-by-Step)

If you prefer running each component separately:

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2: Vision Server
cd Backend_Vision
python main.py

# Terminal 3: Frontend
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
phoenix-ai/
├── 📄 README.md                          # This file
├── 📄 HACKATHON_TECHNICAL_DOCUMENTATION.md # Detailed tech docs
├── 📄 requirements.txt                   # Root Python dependencies
├── 📄 .env.example                       # Environment template
│
├── 🔙 backend/                           # FastAPI REST API
│   ├── main.py                           # API endpoints, database queries
│   ├── requirements.txt                  # FastAPI dependencies
│   ├── Dockerfile                        # Docker config
│   ├── Procfile                          # Deployment config (Railway)
│   ├── railway.toml                      # Railway manifest
│   └── nixpacks.toml                     # Build config
│
├── 🤖 Backend_Vision/                    # Computer Vision Engine
│   ├── main.py                           # WebSocket server & frame loop
│   ├── general_analyzer.py               # Base analyzer class
│   ├── squats.py                         # Squat analyzer (TensorFlow)
│   ├── lunges_vision.py                  # Lunges analyzer
│   ├── WarriorPose.py                    # Warrior pose analyzer
│   ├── legRaises.py                      # Leg raises analyzer
│   ├── bark_tts.py                       # Text-to-speech engine
│   ├── requirements.txt                  # Vision dependencies
│   ├── models_vision/                    # Pre-trained models
│   │   ├── best_squat_model.keras
│   │   ├── preprocessed_data_scaler.joblib
│   │   └── preprocessed_data_label_encoder.joblib
│   └── test_*.py                         # Unit tests
│
├── 🎨 frontend/                          # React 18 + Vite
│   ├── index.html                        # HTML entry point
│   ├── src/
│   │   ├── App.jsx                       # Main app component
│   │   ├── main.jsx                      # React entry
│   │   ├── index.css                     # Global styles
│   │   ├── data.js                       # Mock data
│   │   ├── lib/
│   │   │   └── supabase.js               # Supabase client
│   │   ├── components/                   # Reusable components
│   │   │   ├── UI.jsx
│   │   │   ├── VantaBg.jsx               # 3D background
│   │   │   ├── DoctorHeader.jsx
│   │   │   ├── PatientHeader.jsx
│   │   │   └── ...
│   │   └── pages/                        # Route pages
│   │       ├── shared/
│   │       │   ├── LoginPage.jsx
│   │       │   └── LandingPage.jsx
│   │       ├── doctor/
│   │       │   ├── DoctorDashboard.jsx
│   │       │   ├── DoctorPatientDetail.jsx
│   │       │   ├── DoctorAssignExercise.jsx
│   │       │   └── ...
│   │       └── patient/
│   │           ├── PatientDashboard.jsx
│   │           ├── PatientCameraSession.jsx
│   │           ├── PatientScoreScreen.jsx
│   │           └── ...
│   ├── package.json                      # Dependencies & scripts
│   ├── vite.config.js                    # Vite config
│   ├── public/                           # Static assets
│   └── dist/                             # Production build (after npm run build)
│
├── 💾 supabase_setup.sql                 # Database schema SQL
├── 🐳 Dockerfile                         # Backend Docker
├── graphify-out/                         # Code analysis output
│   ├── GRAPH_REPORT.md                   # Architecture analysis
│   ├── graph.json                        # Node graph data
│   └── cache/                            # AST cache
│
└── .env                                  # Environment variables (add to .gitignore)
```

---

## 🔌 API Documentation

### FastAPI REST Endpoints

All endpoints return JSON and require JWT authentication (from Supabase).

#### Authentication
```
GET  /api/auth/user              # Get current user
POST /api/auth/login              # Login (handled by Supabase)
POST /api/auth/logout             # Logout
```

#### Patient Sessions
```
POST   /api/sessions              # Create new session result
GET    /api/sessions/{id}         # Get session details
GET    /api/sessions/patient/{id} # Get patient's sessions
PATCH  /api/sessions/{id}         # Update session (add feedback)
```

#### Exercises
```
GET    /api/exercises             # List all exercises
GET    /api/exercises/{id}        # Get exercise details
POST   /api/exercises             # Create new exercise (admin)
```

#### Doctor-Patient Connections
```
POST   /api/connections           # Request connection
GET    /api/connections           # Get my connections
PATCH  /api/connections/{id}      # Approve/reject connection
DELETE /api/connections/{id}      # Remove connection
```

#### Feedback
```
POST   /api/feedback              # Send feedback to patient
GET    /api/feedback/patient/{id} # Get patient's feedback
```

### WebSocket Events (Port 8001)

```javascript
// Connect
const ws = new WebSocket('ws://localhost:8001')

// Send frame for analysis
ws.send(JSON.stringify({
  type: 'frame',
  data: base64_encoded_frame,
  exercise_type: 'squats'
}))

// Receive analysis results
ws.onmessage = (event) => {
  const result = JSON.parse(event.data)
  console.log({
    reps: result.reps,
    score: result.score,
    form_errors: result.form_errors,
    voice_feedback: result.voice_feedback
  })
}
```

### Interactive API Documentation

When running locally, visit **http://localhost:8000/docs** for Swagger UI with all endpoints.

---

## 💾 Database Setup

### Automatic Setup (Recommended)

```sql
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Users table (managed by Supabase Auth)

-- Doctor-Patient Connections
create table if not exists public.connections (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  doctor_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now(),
  unique(patient_id, doctor_id)
);

-- Exercise Sessions
create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  exercise_id int not null,
  score int check (score >= 0 and score <= 100),
  reps int,
  duration int,
  joint_scores jsonb,
  feedback_from_doctor text,
  created_at timestamptz default now()
);

-- Exercises Master
create table if not exists public.exercises (
  id int primary key,
  name text not null,
  category text,
  description text,
  instructions text,
  ranges jsonb,
  joint_tracking jsonb
);

-- Feedback Messages
create table if not exists public.feedback (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  doctor_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.connections enable row level security;
alter table public.sessions enable row level security;
alter table public.feedback enable row level security;

-- RLS Policies
create policy "Patients view own sessions"
  on public.sessions for select
  using (auth.uid() = patient_id);

create policy "Doctors view assigned patients' sessions"
  on public.sessions for select
  using (
    exists (
      select 1 from public.connections
      where doctor_id = auth.uid()
      and patient_id = sessions.patient_id
      and status = 'approved'
    )
  );
```

### Create Mock Data

```sql
-- Insert sample exercises
insert into public.exercises (id, name, category, description, instructions, ranges)
values
  (1, 'Squats', 'Lower Body', 'Full body workout', 'Stand with feet shoulder-width apart...', '{}'),
  (2, 'Lunges', 'Lower Body', 'Leg strengthening', 'Step forward and bend knees...', '{}'),
  (3, 'Warrior Pose', 'Balance', 'Yoga stability', 'Stand in warrior position...', '{}'),
  (4, 'Leg Raises', 'Core', 'Abdominal strength', 'Lie down and raise legs...', '{}');
```

---

## 🐛 Troubleshooting

### ❌ Common Issues

#### 1. **"Module not found" errors in Python**

```bash
# Solution: Reinstall dependencies
pip install --upgrade -r requirements.txt
pip install --upgrade -r Backend_Vision/requirements.txt

# Or use a fresh virtual environment
deactivate
rm -rf .venv
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

#### 2. **Supabase connection refused**

```bash
# Check your .env file
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Verify credentials in Supabase dashboard
# Settings → API → URL and Service Role key
```

#### 3. **WebSocket connection errors**

```bash
# Check if port 8001 is in use
# Windows:
netstat -ano | findstr :8001

# macOS/Linux:
lsof -i :8001

# Kill process if needed
# Windows: taskkill /PID <PID> /F
# macOS/Linux: kill -9 <PID>
```

#### 4. **React build errors**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build

# Check Node version (must be 18+)
node --version
```

#### 5. **MediaPipe DLL errors (Windows)**

```bash
# Reinstall MediaPipe with specific version
pip uninstall mediapipe -y
pip install mediapipe==0.10.14

# Or use conda
conda install -c conda-forge mediapipe
```

#### 6. **Port already in use**

```bash
# Kill existing processes
# Port 8000 (Backend)
lsof -ti:8000 | xargs kill -9

# Port 8001 (Vision)
lsof -ti:8001 | xargs kill -9

# Port 5173 (Frontend)
lsof -ti:5173 | xargs kill -9
```

### 🆘 Need Help?

Check the detailed troubleshooting section in [HACKATHON_TECHNICAL_DOCUMENTATION.md](./HACKATHON_TECHNICAL_DOCUMENTATION.md#-troubleshooting)

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod

# Set environment variables in Vercel dashboard
```

### Backend Deployment (Railway)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

Or push to GitHub and enable auto-deploy in Railway dashboard.

---

## 🤝 Contributing

We welcome contributions! Here's how:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make changes
# 4. Commit with clear messages
git commit -m "feat: add new feature"

# 5. Push and create Pull Request
git push origin feature/your-feature-name
```

### Code Style
- **Python:** Follow [PEP 8](https://pep8.org/)
- **JavaScript:** Use 2-space indentation
- **Comments:** Clear and concise

### Testing Before Submission
```bash
# Frontend
cd frontend && npm run build

# Backend
pytest Backend_Vision/test_*.py

# Lint
flake8 backend/ Backend_Vision/
```

---

## 📚 Documentation

### Key Documents
1. **[HACKATHON_TECHNICAL_DOCUMENTATION.md](./HACKATHON_TECHNICAL_DOCUMENTATION.md)** — Comprehensive technical reference, Q&A for judges, architecture details
2. **[API Docs](http://localhost:8000/docs)** — Interactive Swagger UI (when running locally)
3. **[Supabase Docs](https://supabase.com/docs)** — Database & Auth documentation
4. **[MediaPipe Docs](https://developers.google.com/mediapipe)** — Pose detection details

### External Resources
- [React Documentation](https://react.dev)
- [FastAPI Guide](https://fastapi.tiangolo.com/)
- [TensorFlow Keras](https://keras.io/)
- [Supabase CLI](https://supabase.com/docs/reference/cli)

---

## 🏆 Features Highlight

| Feature | Status | Details |
|---------|--------|---------|
| 🤖 Real-time pose detection | ✅ | MediaPipe + 4 exercise analyzers |
| 📊 Form scoring (0-100) | ✅ | Joint-based algorithm |
| 👨‍⚕️ Doctor dashboard | ✅ | Patient management + feedback |
| 📱 Patient app | ✅ | Camera session + score tracking |
| 🌍 Multi-language | ✅ | 50+ languages via Edge TTS |
| 🔐 HIPAA-ready | ✅ | RLS policies + encryption |
| 📈 Analytics | ✅ | Progress charts, trends |
| 🎯 Rep counting | ✅ | Automatic detection |
| 💬 Voice feedback | ✅ | Real-time cues |
| 🚀 Scalable | ✅ | Handles 1000+ users |

---

## 📞 Support

- 💬 Create an issue on GitHub
- 📧 Email: support@phoenixai.dev
- 📖 Check [HACKATHON_TECHNICAL_DOCUMENTATION.md](./HACKATHON_TECHNICAL_DOCUMENTATION.md)

---

## 📄 License

Phoenix AI is released under the **Apache License 2.0** — see [LICENSE](./LICENSE) for details.

---

## 🎉 Quick Checklist

Before deploying, ensure:

- [ ] All 3 services running (Backend, Vision, Frontend)
- [ ] `.env` file configured with Supabase keys
- [ ] Database schema imported
- [ ] Frontend builds without errors (`npm run build`)
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] WebSocket connects at ws://localhost:8001
- [ ] Camera permissions granted in browser

---

## 🎊 Getting Started (TL;DR)

```bash
# 1. Clone & setup
git clone <repo>
cd phoenix-ai
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd frontend && npm install && cd ..

# 2. Configure .env with Supabase credentials

# 3. Run (3 terminals)
# Terminal 1:
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2:
cd Backend_Vision && python main.py

# Terminal 3:
cd frontend && npm run dev

# 4. Open http://localhost:5173
# Demo: Click "Sign in" without credentials
```

---

<div align="center">

**Made with ❤️ by the Phoenix AI Team**

[⬆ Back to Top](#-phoenix-ai--physiotherapy-rehabilitation-reimagined)

</div>
