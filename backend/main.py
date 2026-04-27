from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

# ── Optional: Supabase client for saving sessions ─────────────────────────────
try:
    from supabase import create_client, Client
    _url  = os.getenv("SUPABASE_URL", "")
    _key  = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    supabase: Optional[Client] = create_client(_url, _key) if _url and _key else None
except Exception:
    supabase = None

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Phoenix-AI Backend",
    description="REST API for the Phoenix-AI rehabilitation platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models ────────────────────────────────────────────────────────────────────
class JointScore(BaseModel):
    name: str
    score: int
    status: str   # "good" | "warning"

class SessionResult(BaseModel):
    patient_id:  str
    exercise_id: int
    score:       int
    reps:        int
    duration:    int          # seconds
    joint_scores: List[JointScore]

class FeedbackPayload(BaseModel):
    patient_id: str
    doctor_id:  str
    message:    str

# ── Helpers ───────────────────────────────────────────────────────────────────
def score_label(score: int) -> str:
    if score >= 80:
        return "Excellent session"
    elif score >= 60:
        return "Good effort"
    else:
        return "Keep practicing"

# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "Phoenix-AI Backend", "supabase_connected": supabase is not None}


@app.post("/session")
async def save_session(result: SessionResult):
    """
    Called after a patient completes a camera session.
    Persists the session score + joint breakdown to Supabase.
    """
    payload = {
        "patient_id":   result.patient_id,
        "exercise_id":  result.exercise_id,
        "score":        result.score,
        "reps":         result.reps,
        "duration":     result.duration,
        "joint_scores": [j.model_dump() for j in result.joint_scores],
        "label":        score_label(result.score),
    }

    if supabase:
        try:
            data = supabase.table("sessions").insert(payload).execute()
            return {"success": True, "data": data.data, "label": payload["label"]}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # If Supabase not configured, still return success (demo mode)
    return {"success": True, "data": payload, "label": payload["label"], "note": "Supabase not configured — data not persisted"}


@app.get("/patient/{patient_id}/stats")
async def get_patient_stats(patient_id: str):
    """
    Returns aggregated session stats for a patient.
    """
    if not supabase:
        return {
            "total_sessions": 0,
            "avg_score":      0,
            "best_score":     0,
            "last_session":   None,
            "note":           "Supabase not configured",
        }

    try:
        res    = supabase.table("sessions").select("*").eq("patient_id", patient_id).order("created_at", desc=True).execute()
        items  = res.data or []
        scores = [s["score"] for s in items]
        return {
            "total_sessions": len(items),
            "avg_score":      round(sum(scores) / len(scores), 1) if scores else 0,
            "best_score":     max(scores) if scores else 0,
            "last_session":   items[0] if items else None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/feedback")
async def send_feedback(payload: FeedbackPayload):
    """
    Doctor sends feedback message to a patient.
    """
    row = {
        "patient_id": payload.patient_id,
        "doctor_id":  payload.doctor_id,
        "message":    payload.message,
        "is_read":    False,
    }

    if supabase:
        try:
            data = supabase.table("feedback").insert(row).execute()
            return {"success": True, "data": data.data}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return {"success": True, "data": row, "note": "Supabase not configured — data not persisted"}


@app.get("/feedback/{patient_id}")
async def get_feedback(patient_id: str):
    """
    Fetch all feedback messages for a patient.
    """
    if not supabase:
        return {"data": [], "note": "Supabase not configured"}

    try:
        res = supabase.table("feedback").select("*").eq("patient_id", patient_id).order("created_at", desc=True).execute()
        return {"data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
