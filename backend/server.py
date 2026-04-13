from pathlib import Path
from dotenv import load_dotenv
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import bcrypt
import jwt as pyjwt
import json
import io
import requests as http_requests
import secrets
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from emergentintegrations.llm.chat import LlmChat, UserMessage

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"
def get_jwt_secret():
    return os.environ["JWT_SECRET"]

app = FastAPI(title="ResumeAI API")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ChatMessageRequest(BaseModel):
    session_id: str
    message: str

class CreateResumeRequest(BaseModel):
    job_role: str
    company: Optional[str] = ""

class UpdateResumeRequest(BaseModel):
    title: Optional[str] = None
    template: Optional[str] = None
    personal_info: Optional[Dict] = None
    summary: Optional[str] = None
    education: Optional[Any] = None
    skills: Optional[Any] = None
    experience: Optional[Any] = None
    projects: Optional[Any] = None
    achievements: Optional[Any] = None
    hobbies: Optional[Any] = None

class CreateOrderRequest(BaseModel):
    plan: str

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(hours=2), "type": "access"}
    return pyjwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return pyjwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = pyjwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== CHAT STEPS ====================

CHAT_STEPS = [
    {"id": "name", "question": "Let's start! What's your full name?", "field": "personal_info.name", "optimize": False},
    {"id": "email_addr", "question": "What's your email address?", "field": "personal_info.email", "optimize": False},
    {"id": "phone", "question": "Your phone number?", "field": "personal_info.phone", "optimize": False},
    {"id": "location", "question": "Where are you located? (City, State)", "field": "personal_info.location", "optimize": False},
    {"id": "summary", "question": "Tell me briefly about yourself - your career goals, strengths, and what makes you a great fit.", "field": "summary", "optimize": True},
    {"id": "education", "question": "Tell me about your education - degree, college/university, graduation year, and grades.", "field": "education", "optimize": True},
    {"id": "skills", "question": "What are your key skills? Include both technical and soft skills, separated by commas.", "field": "skills", "optimize": True},
    {"id": "experience", "question": "Any work experience? Share job title, company, duration, and key responsibilities. Type 'skip' if none.", "field": "experience", "optimize": True},
    {"id": "projects", "question": "Describe your best projects - what you built, technologies used, and impact. Type 'skip' if none.", "field": "projects", "optimize": True},
    {"id": "achievements", "question": "Any achievements, awards, or certifications? Type 'skip' if none.", "field": "achievements", "optimize": True},
    {"id": "hobbies", "question": "Any hobbies or interests? Type 'skip' to finish.", "field": "hobbies", "optimize": True},
]

# ==================== AI HELPERS ====================

async def optimize_with_ai(text: str, field: str, job_role: str, company: str) -> Any:
    llm_key = os.environ.get("EMERGENT_LLM_KEY")
    if not llm_key:
        return text
    try:
        chat = LlmChat(
            api_key=llm_key,
            session_id=f"opt-{uuid.uuid4()}",
            system_message=f"""You are a professional resume writer creating content for a {job_role} position{' at ' + company if company else ''}.
Rules:
- Write in professional, ATS-friendly language
- Use strong action verbs and quantify achievements
- Be concise and impactful
- Return ONLY the optimized content, no explanations"""
        )
        chat.with_model("openai", "gpt-4o")

        if field == "summary":
            msg = f"Write a professional summary (2-3 sentences) based on: {text}"
            response = await chat.send_message(UserMessage(text=msg))
            return response.strip() if response else text

        if field == "education":
            msg = f'Parse and optimize this education info into JSON array: [{{"degree":"...","institution":"...","year":"...","gpa":"..."}}]. Input: {text}. Return ONLY valid JSON.'
            response = await chat.send_message(UserMessage(text=msg))
            return _parse_json(response, text)

        if field == "skills":
            msg = f'Parse these skills into a JSON array of strings, adding relevant keywords for {job_role}. Input: {text}. Return ONLY valid JSON array.'
            response = await chat.send_message(UserMessage(text=msg))
            return _parse_json(response, text)

        if field == "experience":
            msg = f'Parse this work experience into JSON array: [{{"title":"...","company":"...","duration":"...","description":"..."}}]. Make descriptions professional with action verbs. Input: {text}. Return ONLY valid JSON.'
            response = await chat.send_message(UserMessage(text=msg))
            return _parse_json(response, text)

        if field == "projects":
            msg = f'Parse these projects into JSON array: [{{"name":"...","description":"...","tech":"..."}}]. Make descriptions impactful. Input: {text}. Return ONLY valid JSON.'
            response = await chat.send_message(UserMessage(text=msg))
            return _parse_json(response, text)

        if field == "achievements":
            msg = f'Parse these achievements into a JSON array of strings. Make each professional and impactful. Input: {text}. Return ONLY valid JSON array.'
            response = await chat.send_message(UserMessage(text=msg))
            return _parse_json(response, text)

        if field == "hobbies":
            msg = f'Parse these hobbies into a JSON array of strings. Input: {text}. Return ONLY valid JSON array.'
            response = await chat.send_message(UserMessage(text=msg))
            return _parse_json(response, text)

        return text
    except Exception as e:
        logger.error(f"AI optimization error: {e}")
        return text

def _parse_json(response: str, fallback):
    try:
        cleaned = response.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
            cleaned = cleaned.rsplit("```", 1)[0]
        return json.loads(cleaned.strip())
    except Exception:
        return fallback

# ==================== AUTH ROUTES ====================

auth_router = APIRouter(prefix="/api/auth", tags=["auth"])

@auth_router.post("/register")
async def register(req: RegisterRequest, response: Response):
    email = req.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id, "name": req.name, "email": email,
        "password_hash": hash_password(req.password),
        "plan": "free", "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=7200, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return {"id": user_id, "name": req.name, "email": email, "plan": "free", "role": "user"}

@auth_router.post("/login")
async def login(req: LoginRequest, response: Response):
    email = req.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user.pop("_id", None)
    user.pop("password_hash", None)
    access_token = create_access_token(user["id"], email)
    refresh_token = create_refresh_token(user["id"])
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=7200, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return user

@auth_router.get("/me")
async def get_me(request: Request):
    return await get_current_user(request)

@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}

@auth_router.post("/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = pyjwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access_token = create_access_token(user["id"], user["email"])
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=7200, path="/")
        return {"message": "Token refreshed"}
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")

# ==================== GOOGLE OAUTH (Emergent Auth) ====================

class GoogleSessionRequest(BaseModel):
    session_id: str

@auth_router.post("/google/session")
async def google_session(req: GoogleSessionRequest, response: Response):
    """Exchange Emergent Auth session_id for user data and issue JWT"""
    try:
        resp = http_requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": req.session_id},
            timeout=10
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google session")
        google_data = resp.json()
    except http_requests.RequestException:
        raise HTTPException(status_code=502, detail="Failed to verify Google session")

    email = google_data.get("email", "").lower().strip()
    name = google_data.get("name", "")
    picture = google_data.get("picture", "")
    if not email:
        raise HTTPException(status_code=400, detail="No email from Google")

    existing = await db.users.find_one({"email": email})
    if existing:
        # Update Google info on existing user
        await db.users.update_one({"email": email}, {"$set": {
            "name": name or existing.get("name", ""),
            "picture": picture,
            "google_linked": True,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }})
        user_id = existing["id"]
        plan = existing.get("plan", "free")
        role = existing.get("role", "user")
    else:
        # Create new user from Google data
        user_id = str(uuid.uuid4())
        await db.users.insert_one({
            "id": user_id, "name": name, "email": email,
            "password_hash": "", "picture": picture,
            "google_linked": True,
            "plan": "free", "role": "user",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        plan = "free"
        role = "user"

    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=7200, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return {"id": user_id, "name": name, "email": email, "plan": plan, "role": role, "picture": picture}

# ==================== RESUME ROUTES ====================

resume_router = APIRouter(prefix="/api/resumes", tags=["resumes"])

@resume_router.get("/")
async def list_resumes(request: Request):
    user = await get_current_user(request)
    resumes = await db.resumes.find({"user_id": user["id"]}, {"_id": 0}).sort("updated_at", -1).to_list(100)
    return resumes

@resume_router.get("/{resume_id}")
async def get_resume(resume_id: str, request: Request):
    user = await get_current_user(request)
    resume = await db.resumes.find_one({"id": resume_id, "user_id": user["id"]}, {"_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@resume_router.put("/{resume_id}")
async def update_resume(resume_id: str, req: UpdateResumeRequest, request: Request):
    user = await get_current_user(request)
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.resumes.update_one({"id": resume_id, "user_id": user["id"]}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    resume = await db.resumes.find_one({"id": resume_id}, {"_id": 0})
    return resume

@resume_router.delete("/{resume_id}")
async def delete_resume(resume_id: str, request: Request):
    user = await get_current_user(request)
    result = await db.resumes.delete_one({"id": resume_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    await db.chat_sessions.delete_many({"resume_id": resume_id})
    return {"message": "Resume deleted"}

@resume_router.post("/{resume_id}/duplicate")
async def duplicate_resume(resume_id: str, request: Request):
    user = await get_current_user(request)
    if user.get("plan") == "free":
        count = await db.resumes.count_documents({"user_id": user["id"]})
        if count >= 1:
            raise HTTPException(status_code=403, detail="Free plan allows only 1 resume. Upgrade to Pro!")
    original = await db.resumes.find_one({"id": resume_id, "user_id": user["id"]}, {"_id": 0})
    if not original:
        raise HTTPException(status_code=404, detail="Resume not found")
    new_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    new_resume = {**original, "id": new_id, "title": f"{original.get('title', 'Resume')} (Copy)", "created_at": now, "updated_at": now}
    await db.resumes.insert_one(new_resume)
    new_resume.pop("_id", None)
    return new_resume

# ==================== SHARE ROUTES ====================

@resume_router.post("/{resume_id}/share")
async def share_resume(resume_id: str, request: Request):
    user = await get_current_user(request)
    resume = await db.resumes.find_one({"id": resume_id, "user_id": user["id"]}, {"_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    share_id = resume.get("share_id")
    if not share_id:
        share_id = secrets.token_urlsafe(12)
        await db.resumes.update_one({"id": resume_id}, {"$set": {"share_id": share_id, "updated_at": datetime.now(timezone.utc).isoformat()}})
    return {"share_id": share_id}

# ==================== ATS SCORING ====================

@resume_router.post("/{resume_id}/score")
async def score_resume(resume_id: str, request: Request):
    user = await get_current_user(request)
    resume = await db.resumes.find_one({"id": resume_id, "user_id": user["id"]}, {"_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    llm_key = os.environ.get("EMERGENT_LLM_KEY")
    if not llm_key:
        raise HTTPException(status_code=500, detail="AI scoring unavailable")
    try:
        resume_text = _build_resume_text(resume)
        chat = LlmChat(
            api_key=llm_key,
            session_id=f"score-{uuid.uuid4()}",
            system_message="""You are an expert ATS (Applicant Tracking System) resume analyst. Score the resume and provide actionable feedback.
Return ONLY valid JSON in this exact format:
{"score": 75, "sections": {"formatting": {"score": 80, "feedback": "..."}, "keywords": {"score": 70, "feedback": "..."}, "experience": {"score": 75, "feedback": "..."}, "skills": {"score": 80, "feedback": "..."}, "education": {"score": 70, "feedback": "..."}}, "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"], "keywords_missing": ["keyword1", "keyword2"]}"""
        )
        chat.with_model("openai", "gpt-4o")
        msg = f"Score this resume for a {resume.get('job_role', 'general')} position{' at ' + resume.get('company') if resume.get('company') else ''}:\n\n{resume_text}"
        response = await chat.send_message(UserMessage(text=msg))
        score_data = _parse_json(response, None)
        if not score_data or not isinstance(score_data, dict):
            score_data = {"score": 70, "sections": {}, "suggestions": ["Could not fully analyze. Try completing all sections."], "keywords_missing": []}
        # Store score
        await db.resumes.update_one({"id": resume_id}, {"$set": {"ats_score": score_data, "updated_at": datetime.now(timezone.utc).isoformat()}})
        return score_data
    except Exception as e:
        logger.error(f"ATS scoring error: {e}")
        raise HTTPException(status_code=500, detail="Failed to score resume")

def _build_resume_text(resume: dict) -> str:
    parts = []
    pi = resume.get("personal_info", {})
    if pi.get("name"): parts.append(f"Name: {pi['name']}")
    if pi.get("email"): parts.append(f"Email: {pi['email']}")
    if pi.get("phone"): parts.append(f"Phone: {pi['phone']}")
    if pi.get("location"): parts.append(f"Location: {pi['location']}")
    if resume.get("summary"): parts.append(f"\nSummary: {resume['summary']}")
    edu = resume.get("education", [])
    if edu:
        parts.append("\nEducation:")
        if isinstance(edu, list):
            for e in edu:
                if isinstance(e, dict):
                    parts.append(f"  {e.get('degree','')} - {e.get('institution','')} ({e.get('year','')})")
                else:
                    parts.append(f"  {e}")
        else:
            parts.append(f"  {edu}")
    skills = resume.get("skills", [])
    if skills:
        parts.append(f"\nSkills: {', '.join(str(s) for s in skills) if isinstance(skills, list) else str(skills)}")
    exp = resume.get("experience", [])
    if exp:
        parts.append("\nExperience:")
        if isinstance(exp, list):
            for e in exp:
                if isinstance(e, dict):
                    parts.append(f"  {e.get('title','')} at {e.get('company','')} ({e.get('duration','')}): {e.get('description','')}")
                else:
                    parts.append(f"  {e}")
        else:
            parts.append(f"  {exp}")
    proj = resume.get("projects", [])
    if proj:
        parts.append("\nProjects:")
        if isinstance(proj, list):
            for p in proj:
                if isinstance(p, dict):
                    parts.append(f"  {p.get('name','')} ({p.get('tech','')}): {p.get('description','')}")
                else:
                    parts.append(f"  {p}")
        else:
            parts.append(f"  {proj}")
    ach = resume.get("achievements", [])
    if ach:
        parts.append(f"\nAchievements: {', '.join(str(a) for a in ach) if isinstance(ach, list) else str(ach)}")
    return "\n".join(parts)

# ==================== CHAT ROUTES ====================

chat_router = APIRouter(prefix="/api/chat", tags=["chat"])

@chat_router.post("/start")
async def start_chat(req: CreateResumeRequest, request: Request):
    user = await get_current_user(request)
    if user.get("plan") == "free":
        count = await db.resumes.count_documents({"user_id": user["id"]})
        if count >= 1:
            raise HTTPException(status_code=403, detail="Free plan allows only 1 resume. Upgrade to Pro for unlimited resumes!")
    resume_id = str(uuid.uuid4())
    session_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    resume_doc = {
        "id": resume_id, "user_id": user["id"],
        "title": f"{req.job_role}{' at ' + req.company if req.company else ''}",
        "job_role": req.job_role, "company": req.company or "",
        "template": "modern",
        "personal_info": {"name": "", "email": "", "phone": "", "location": ""},
        "summary": "", "education": [], "skills": [], "experience": [],
        "projects": [], "achievements": [], "hobbies": [],
        "status": "draft", "created_at": now, "updated_at": now
    }
    first_step = CHAT_STEPS[0]
    greeting = f"I'll help you create a perfect resume for **{req.job_role}**{' at **' + req.company + '**' if req.company else ''}! Let's make HR say YES in 6 seconds."
    session_doc = {
        "id": session_id, "user_id": user["id"], "resume_id": resume_id,
        "job_role": req.job_role, "company": req.company or "",
        "messages": [
            {"role": "ai", "content": greeting, "step": None, "timestamp": now},
            {"role": "ai", "content": first_step["question"], "step": first_step["id"], "timestamp": now}
        ],
        "current_step_index": 0, "completed": False, "created_at": now
    }
    await db.resumes.insert_one(resume_doc)
    await db.chat_sessions.insert_one(session_doc)
    resume_doc.pop("_id", None)
    session_doc.pop("_id", None)
    return {"session": session_doc, "resume": resume_doc}

@chat_router.post("/message")
async def send_message(req: ChatMessageRequest, request: Request):
    user = await get_current_user(request)
    session = await db.chat_sessions.find_one({"id": req.session_id, "user_id": user["id"]})
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    if session.get("completed"):
        raise HTTPException(status_code=400, detail="Resume already complete")

    current_index = session["current_step_index"]
    current_step = CHAT_STEPS[current_index]
    now = datetime.now(timezone.utc).isoformat()
    user_msg = {"role": "user", "content": req.message, "step": current_step["id"], "timestamp": now}
    is_skip = req.message.strip().lower() == "skip"
    field = current_step["field"]

    if not is_skip:
        if current_step.get("optimize"):
            optimized = await optimize_with_ai(req.message, field, session["job_role"], session.get("company", ""))
            await db.resumes.update_one({"id": session["resume_id"]}, {"$set": {field: optimized, "updated_at": now}})
        elif "." in field:
            await db.resumes.update_one({"id": session["resume_id"]}, {"$set": {field: req.message.strip(), "updated_at": now}})
        else:
            await db.resumes.update_one({"id": session["resume_id"]}, {"$set": {field: req.message.strip(), "updated_at": now}})

    next_index = current_index + 1
    is_complete = next_index >= len(CHAT_STEPS)
    messages_to_add = [user_msg]

    if is_complete:
        ai_msg = {"role": "ai", "content": "Your resume is ready! Preview it, pick a template, and download as PDF. You can also edit any section directly.", "step": "complete", "timestamp": now}
        messages_to_add.append(ai_msg)
        await db.resumes.update_one({"id": session["resume_id"]}, {"$set": {"status": "complete", "updated_at": now}})
        await db.chat_sessions.update_one({"id": req.session_id}, {
            "$push": {"messages": {"$each": messages_to_add}},
            "$set": {"current_step_index": next_index, "completed": True}
        })
    else:
        next_step = CHAT_STEPS[next_index]
        ai_msg = {"role": "ai", "content": next_step["question"], "step": next_step["id"], "timestamp": now}
        messages_to_add.append(ai_msg)
        await db.chat_sessions.update_one({"id": req.session_id}, {
            "$push": {"messages": {"$each": messages_to_add}},
            "$set": {"current_step_index": next_index}
        })

    updated_resume = await db.resumes.find_one({"id": session["resume_id"]}, {"_id": 0})
    updated_session = await db.chat_sessions.find_one({"id": req.session_id}, {"_id": 0})
    return {"session": updated_session, "resume": updated_resume}

@chat_router.get("/session/{session_id}")
async def get_chat_session(session_id: str, request: Request):
    user = await get_current_user(request)
    session = await db.chat_sessions.find_one({"id": session_id, "user_id": user["id"]}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    resume = await db.resumes.find_one({"id": session["resume_id"]}, {"_id": 0})
    return {"session": session, "resume": resume}

# ==================== PAYMENT ROUTES ====================

payment_router = APIRouter(prefix="/api/payments", tags=["payments"])

PLANS = {
    "per_resume": {"name": "Per Resume", "amount": 9900, "currency": "INR", "description": "One premium resume with all templates"},
    "monthly": {"name": "Monthly Pro", "amount": 49900, "currency": "INR", "description": "Unlimited resumes for 30 days"}
}

@payment_router.get("/plans")
async def get_plans():
    return PLANS

@payment_router.post("/create-order")
async def create_order(req: CreateOrderRequest, request: Request):
    user = await get_current_user(request)
    plan = PLANS.get(req.plan)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan")
    razorpay_key_id = os.environ.get("RAZORPAY_KEY_ID")
    razorpay_key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
    if not razorpay_key_id or not razorpay_key_secret:
        order_id = f"order_mock_{uuid.uuid4().hex[:16]}"
        payment_doc = {
            "id": str(uuid.uuid4()), "user_id": user["id"], "order_id": order_id,
            "amount": plan["amount"], "currency": plan["currency"],
            "plan": req.plan, "status": "created", "mock": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.payments.insert_one(payment_doc)
        return {"order_id": order_id, "amount": plan["amount"], "currency": plan["currency"], "key_id": "mock_key", "mock": True}
    import razorpay
    rz_client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))
    order = rz_client.order.create({"amount": plan["amount"], "currency": plan["currency"], "payment_capture": 1})
    payment_doc = {
        "id": str(uuid.uuid4()), "user_id": user["id"], "order_id": order["id"],
        "amount": plan["amount"], "currency": plan["currency"],
        "plan": req.plan, "status": "created", "mock": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payments.insert_one(payment_doc)
    return {"order_id": order["id"], "amount": plan["amount"], "currency": plan["currency"], "key_id": razorpay_key_id, "mock": False}

@payment_router.post("/verify")
async def verify_payment(request: Request):
    user = await get_current_user(request)
    body = await request.json()
    order_id = body.get("order_id")
    payment = await db.payments.find_one({"order_id": order_id, "user_id": user["id"]})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.get("mock"):
        await db.payments.update_one({"order_id": order_id}, {"$set": {"status": "paid"}})
        await db.users.update_one({"id": user["id"]}, {"$set": {"plan": "pro"}})
        return {"status": "success", "message": "Payment verified (mock mode)", "plan": "pro"}
    razorpay_key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
    import razorpay
    rz_client = razorpay.Client(auth=(os.environ["RAZORPAY_KEY_ID"], razorpay_key_secret))
    try:
        rz_client.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": body.get("payment_id", ""),
            "razorpay_signature": body.get("signature", "")
        })
        await db.payments.update_one({"order_id": order_id}, {"$set": {"status": "paid", "payment_id": body.get("payment_id")}})
        await db.users.update_one({"id": user["id"]}, {"$set": {"plan": "pro"}})
        return {"status": "success", "message": "Payment verified", "plan": "pro"}
    except Exception:
        raise HTTPException(status_code=400, detail="Payment verification failed")

# ==================== PDF ROUTE ====================

@app.get("/api/resumes/{resume_id}/download-pdf")
async def download_pdf(resume_id: str, request: Request):
    user = await get_current_user(request)
    resume = await db.resumes.find_one({"id": resume_id, "user_id": user["id"]}, {"_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    from utils.pdf_generator import generate_resume_pdf
    pdf_buffer = generate_resume_pdf(resume)
    name = resume.get("personal_info", {}).get("name", "resume").replace(" ", "_")
    return StreamingResponse(
        pdf_buffer, media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={name}_resume.pdf"}
    )

# ==================== PUBLIC ROUTES (No Auth) ====================

@app.get("/api/public/resume/{share_id}")
async def get_public_resume(share_id: str):
    resume = await db.resumes.find_one({"share_id": share_id}, {"_id": 0, "user_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

# ==================== INCLUDE ROUTERS ====================

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(chat_router)
app.include_router(payment_router)

@app.get("/api/")
async def root():
    return {"message": "ResumeAI API v1.0"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.resumes.create_index("user_id")
    await db.resumes.create_index("id", unique=True)
    await db.chat_sessions.create_index("id", unique=True)
    await db.chat_sessions.create_index("resume_id")
    await db.payments.create_index("order_id")
    await db.resumes.create_index("share_id", sparse=True)
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@resumeai.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "name": "Admin", "email": admin_email,
            "password_hash": hash_password(admin_password),
            "plan": "pro", "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user seeded: {admin_email}")
    logger.info("ResumeAI API started")

@app.on_event("shutdown")
async def shutdown():
    client.close()
