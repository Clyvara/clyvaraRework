from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import uuid4
import random
import json

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()
        
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
    return {"blank get request"}

@app.post("/items")
async def create_item(item: Dict):
    print("Received from POST:", item)
    return {"json data": item}


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
