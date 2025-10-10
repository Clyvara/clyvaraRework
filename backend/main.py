from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import uuid4
import random
import json

from openai import OpenAI
from dotenv import load_dotenv
import os

from sqlalchemy.orm import Session
from database import get_db, test_connection, ChatMessage, UserInteraction, UserSession

load_dotenv()

# Initialize OpenAI client only if API key is available
openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key and openai_api_key != "your_openai_api_key_here":
    client = OpenAI(api_key=openai_api_key)
else:
    client = None
        
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.get("/")
def root():
    return {"message": "Clyvara Backend API", "status": "running"}

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected" if test_connection() else "disconnected"
    }

@app.post("/items")
async def create_item(item: Dict):
    print("Received from POST:", item)
    return {"json data": item}

# Database API Endpoints

@app.get("/api/chat-messages")
def get_chat_messages(
    session_id: Optional[str] = None,
    user_id: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get chat messages with optional filtering"""
    try:
        query = db.query(ChatMessage)
        
        if session_id:
            query = query.filter(ChatMessage.session_id == session_id)
        if user_id:
            query = query.filter(ChatMessage.user_id == user_id)
        
        messages = query.order_by(ChatMessage.timestamp.desc()).limit(limit).all()
        return {"messages": [{"id": str(msg.id), "session_id": msg.session_id, "message_type": msg.message_type, 
                             "timestamp": msg.timestamp.isoformat() if msg.timestamp else None, "user_id": str(msg.user_id) if msg.user_id else None} for msg in messages]}
    except Exception as e:
        return {"error": f"Database error: {str(e)}", "message": "Tables may not exist yet. Please create them first."}

@app.post("/api/chat-messages")
def create_chat_message(
    session_id: str,
    message_type: str,
    message_content: Dict,
    thread_id: Optional[str] = None,
    user_id: Optional[str] = None,
    response_time_ms: Optional[int] = None,
    message_length: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Create a new chat message"""
    message = ChatMessage(
        session_id=session_id,
        message_type=message_type,
        message_content=message_content,
        thread_id=thread_id,
        user_id=user_id,
        response_time_ms=response_time_ms,
        message_length=message_length
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return {"message": "Chat message created", "id": message.id}

@app.get("/api/user-sessions")
def get_user_sessions(
    user_id: Optional[str] = None,
    is_active: Optional[bool] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get user sessions with optional filtering"""
    try:
        query = db.query(UserSession)
        
        if user_id:
            query = query.filter(UserSession.user_id == user_id)
        if is_active is not None:
            query = query.filter(UserSession.is_active == is_active)
        
        sessions = query.order_by(UserSession.created_at.desc()).limit(limit).all()
        return {"sessions": [{"id": str(sess.id), "session_id": sess.session_id, "user_id": str(sess.user_id) if sess.user_id else None,
                             "created_at": sess.created_at.isoformat() if sess.created_at else None, "is_active": sess.is_active} for sess in sessions]}
    except Exception as e:
        return {"error": f"Database error: {str(e)}", "message": "Tables may not exist yet. Please create them first."}

@app.get("/api/user-interactions")
def get_user_interactions(
    user_id: Optional[str] = None,
    session_id: Optional[str] = None,
    interaction_type: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get user interactions with optional filtering"""
    try:
        query = db.query(UserInteraction)
        
        if user_id:
            query = query.filter(UserInteraction.user_id == user_id)
        if session_id:
            query = query.filter(UserInteraction.session_id == session_id)
        if interaction_type:
            query = query.filter(UserInteraction.interaction_type == interaction_type)
        
        interactions = query.order_by(UserInteraction.timestamp.desc()).limit(limit).all()
        return {"interactions": [{"id": str(inter.id), "session_id": inter.session_id, "user_id": str(inter.user_id) if inter.user_id else None,
                                 "interaction_type": inter.interaction_type, "timestamp": inter.timestamp.isoformat() if inter.timestamp else None} for inter in interactions]}
    except Exception as e:
        return {"error": f"Database error: {str(e)}", "message": "Tables may not exist yet. Please create them first."}


# Chatbot Setup

with open("systemprompt.txt", "r", encoding="utf-8") as f:
    SYSTEM_PROMPT = f.read()

SESSIONS: Dict[str, Optional[str]] = {}

PRIORITY_WORDS = {
    "login","log in","signin","sign in","sign-in",
    "logout","sign out","register","sign up",
    "profile","account","menu","pricing","help","docs","dashboard"
}

def _safe_text(x: Optional[str]) -> str:
    if not isinstance(x, str):
        return ""
    return x.strip()

def summarize_context_on_server(ctx: dict, limit: int = 24) -> dict:
    """
    Keep payload tiny & focused. Prefer nav/auth items; fallback to a few elements.
    """
    if not isinstance(ctx, dict):
        return {}

    url   = _safe_text(ctx.get("url"))
    title = _safe_text(ctx.get("title"))
    headings = ctx.get("headings") or []
    elements = ctx.get("elements") or []

    clean_headings = []
    for h in headings[:8]:
        if isinstance(h, dict):
            clean_headings.append({
                "tag": _safe_text(h.get("tag")),
                "text": _safe_text(h.get("text"))[:120],
            })

    prioritized: List[dict] = []
    for el in elements:
        if not isinstance(el, dict):
            continue
        text = _safe_text(el.get("text") or el.get("ariaLabel"))
        if any(w in text.lower() for w in PRIORITY_WORDS) or _safe_text(el.get("dataQa")):
            prioritized.append({
                "tag": _safe_text(el.get("tag")),
                "text": text[:80],
                "ariaLabel": _safe_text(el.get("ariaLabel"))[:80],
                "href": _safe_text(el.get("href"))[:200],
                "id": _safe_text(el.get("id"))[:80],
                "dataQa": _safe_text(el.get("dataQa"))[:80],
                "region": _safe_text(el.get("region"))[:20],
            })
            if len(prioritized) >= limit:
                break

    if not prioritized:
        for el in elements[:limit]:
            if not isinstance(el, dict):
                continue
            prioritized.append({
                "tag": _safe_text(el.get("tag")),
                "text": _safe_text(el.get("text"))[:80],
                "ariaLabel": _safe_text(el.get("ariaLabel"))[:80],
                "href": _safe_text(el.get("href"))[:200],
                "id": _safe_text(el.get("id"))[:80],
                "dataQa": _safe_text(el.get("dataQa"))[:80],
                "region": _safe_text(el.get("region"))[:20],
            })

    return {
        "url": url,
        "title": title,
        "headings": clean_headings,
        "elements": prioritized,
    }

def build_page_context_message(ctx: Optional[dict]) -> Optional[dict]:
    """
    Convert summarized context into a compact system message the model can use.
    """
    if not ctx:
        return None
    summary = summarize_context_on_server(ctx)
    if not summary:
        return None
    content = "PAGE_CONTEXT:\n" + json.dumps(summary, ensure_ascii=False)
    return {"role": "system", "content": content}


class ChatIn(BaseModel):
    message: str
    thread_id: Optional[str] = None
    page_context: Optional[dict] = None

class ChatOut(BaseModel):
    reply: str
    thread_id: str

@app.post("/chat", response_model=ChatOut)
def chat(payload: ChatIn):
    # create or reuse a thread
    thread_id = payload.thread_id or str(uuid4())
    prev = SESSIONS.get(thread_id)

    if payload.message.lower().strip() in {"bye", "close"}:
        SESSIONS.pop(thread_id, None)
        return ChatOut(
            reply="Chat closed.",
            thread_id=thread_id
        )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]

    pcm = build_page_context_message(payload.page_context)
    if pcm:
        messages.append(pcm)

    messages.append({"role": "user", "content": payload.message})

    resp = client.responses.create(
        model="gpt-5-nano",
        input=messages,
        previous_response_id=prev,
    )
    SESSIONS[thread_id] = resp.id

    return ChatOut(reply=resp.output_text, thread_id=thread_id)
