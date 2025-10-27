from fastapi import FastAPI, Request, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import uuid4
import random
import json
import boto3
import PyPDF2
import io
from docx import Document

from openai import OpenAI
from dotenv import load_dotenv
import os
import jwt
from fastapi import Header

from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db, test_connection, ChatMessage, UserInteraction, UserSession, Material, VectorIndexEntry

load_dotenv()

# Supabase JWT secret for token verification
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

def get_current_user(authorization: str = Header(None)):
    """Extract user info from Supabase JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split(" ")[1]
    
    try:
        # For Supabase tokens, decode without signature verification for now
        # This is a simplified approach for development
        payload = jwt.decode(token, options={"verify_signature": False})
        
        return {
            "user_id": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role", "authenticated")
        }
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token error: {str(e)}")

# Initialize OpenAI client only if API key is available
openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key and openai_api_key != "your_openai_api_key_here":
    client = OpenAI(api_key=openai_api_key)
else:
    client = None

# AWS S3 Configuration
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-2")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "clyvara-uploads")

# Initialize S3 client
if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
    s3_client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
else:
    s3_client = None
        
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001", "http://localhost:8002", "http://localhost:8003"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# File processing functions
def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting PDF text: {str(e)}")

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting DOCX text: {str(e)}")

def extract_text_from_file(file_content: bytes, file_type: str) -> str:
    """Extract text based on file type"""
    if file_type.lower() == "pdf":
        return extract_text_from_pdf(file_content)
    elif file_type.lower() in ["docx", "doc"]:
        return extract_text_from_docx(file_content)
    elif file_type.lower() == "txt":
        return file_content.decode('utf-8')
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_type}")

def generate_embeddings(text: str) -> List[float]:
    """Generate embeddings for text using OpenAI"""
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI client not configured")
    
    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {str(e)}")

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """Split text into overlapping chunks for better retrieval"""
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    
    return chunks

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

@app.get("/api/tables")
def list_tables(db: Session = Depends(get_db)):
    """List all tables in the database"""
    try:
        from sqlalchemy import text
        result = db.execute(text("""
            SELECT table_name, table_schema 
            FROM information_schema.tables 
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
            ORDER BY table_schema, table_name
        """))
        tables = [{"schema": row[1], "table": row[0]} for row in result]
        return {"tables": tables, "count": len(tables)}
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}

@app.post("/api/test-auth")
def test_authentication_flow(
    test_user_id: str = "550e8400-e29b-41d4-a716-446655440000",
    test_email: str = "test@example.com",
    db: Session = Depends(get_db)
):
    """Test the complete Supabase → AWS flow"""
    try:
        # First create a user session (required for foreign key)
        test_session = UserSession(
            session_id="test-session-123",
            user_id=test_user_id,
            is_active=True
        )
        db.add(test_session)
        db.commit()
        
        # Now create a chat message with Supabase user ID
        test_message = ChatMessage(
            session_id="test-session-123",
            message_type="test",
            message_content={"test": "Supabase → AWS connection working!"},
            user_id=test_user_id,  # This would come from Supabase JWT
            response_time_ms=100,
            message_length=50
        )
        
        db.add(test_message)
        db.commit()
        db.refresh(test_message)
        
        # Verify the data was stored
        stored_message = db.query(ChatMessage).filter(
            ChatMessage.user_id == test_user_id
        ).first()
        
        return {
            "status": "success",
            "message": "Supabase → AWS connection working!",
            "supabase_user_id": test_user_id,
            "aws_stored_data": {
                "message_id": str(stored_message.id),
                "user_id": stored_message.user_id,
                "content": stored_message.message_content,
                "timestamp": stored_message.timestamp.isoformat()
            }
        }
    except Exception as e:
        return {"error": f"Connection test failed: {str(e)}"}

@app.get("/api/user-data/{user_id}")
def get_user_data(user_id: str, db: Session = Depends(get_db)):
    """Get all data for a specific Supabase user from AWS"""
    try:
        # Get chat messages for this user
        messages = db.query(ChatMessage).filter(
            ChatMessage.user_id == user_id
        ).all()
        
        # Get user interactions
        interactions = db.query(UserInteraction).filter(
            UserInteraction.user_id == user_id
        ).all()
        
        return {
            "supabase_user_id": user_id,
            "chat_messages": [
                {
                    "id": str(msg.id),
                    "content": msg.message_content,
                    "timestamp": msg.timestamp.isoformat()
                } for msg in messages
            ],
            "user_interactions": [
                {
                    "id": str(inter.id),
                    "type": inter.interaction_type,
                    "timestamp": inter.timestamp.isoformat()
                } for inter in interactions
            ],
            "total_messages": len(messages),
            "total_interactions": len(interactions)
        }
    except Exception as e:
        return {"error": f"Failed to get user data: {str(e)}"}

@app.get("/api/all-users-with-data")
def get_all_users_with_data(db: Session = Depends(get_db)):
    """Get all Supabase users who have data in AWS"""
    try:
        # Get all unique user IDs from chat messages (filter out None)
        chat_users = db.query(ChatMessage.user_id).filter(ChatMessage.user_id.isnot(None)).distinct().all()
        chat_user_ids = [str(user[0]) for user in chat_users if user[0] is not None]
        
        # Get all unique user IDs from user interactions (filter out None)
        interaction_users = db.query(UserInteraction.user_id).filter(UserInteraction.user_id.isnot(None)).distinct().all()
        interaction_user_ids = [str(user[0]) for user in interaction_users if user[0] is not None]
        
        # Combine and deduplicate
        all_user_ids = list(set(chat_user_ids + interaction_user_ids))
        
        # Get user details for each
        user_data = []
        for user_id in all_user_ids:
            messages = db.query(ChatMessage).filter(ChatMessage.user_id == user_id).count()
            interactions = db.query(UserInteraction).filter(UserInteraction.user_id == user_id).count()
            
            user_data.append({
                "supabase_user_id": user_id,
                "total_messages": messages,
                "total_interactions": interactions,
                "has_data": messages > 0 or interactions > 0
            })
        
        return {
            "users_with_data": user_data,
            "total_users": len(user_data),
            "summary": {
                "users_with_chat_messages": len([u for u in user_data if u["total_messages"] > 0]),
                "users_with_interactions": len([u for u in user_data if u["total_interactions"] > 0])
            }
        }
    except Exception as e:
        return {"error": f"Failed to get user data: {str(e)}"}

@app.get("/api/recent-chat-messages")
def get_recent_chat_messages(db: Session = Depends(get_db)):
    """Get recent chat messages from the database"""
    try:
        # Get the 10 most recent chat messages
        messages = db.query(ChatMessage).order_by(ChatMessage.timestamp.desc()).limit(10).all()
        
        return {
            "recent_messages": [
                {
                    "id": str(msg.id),
                    "user_id": str(msg.user_id),
                    "message_content": msg.message_content,
                    "timestamp": msg.timestamp.isoformat(),
                    "session_id": msg.session_id
                } for msg in messages
            ],
            "total_messages": len(messages)
        }
    except Exception as e:
        return {"error": f"Failed to get chat messages: {str(e)}"}

@app.get("/api/debug-user")
def debug_user(current_user: dict = Depends(get_current_user)):
    """Debug endpoint to check user extraction"""
    return {
        "user_info": current_user,
        "user_id": current_user.get("user_id"),
        "email": current_user.get("email")
    }

@app.post("/api/test-real-auth")
def test_real_supabase_auth(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Test with real Supabase JWT token"""
    try:
        if not authorization or not authorization.startswith("Bearer "):
            return {"error": "No valid authorization header provided"}
        
        token = authorization.split(" ")[1]
        current_user = get_current_user(token)
        
        # Create a test message with the real Supabase user
        test_message = ChatMessage(
            session_id=f"session-{current_user['sub']}",
            message_type="real_auth_test",
            message_content={"message": "Real Supabase user authenticated!", "email": current_user.get('email')},
            user_id=current_user['sub'],
            response_time_ms=50,
            message_length=100
        )
        
        db.add(test_message)
        db.commit()
        db.refresh(test_message)
        
        return {
            "status": "success",
            "message": "Real Supabase authentication working!",
            "supabase_user": {
                "id": current_user['sub'],
                "email": current_user.get('email'),
                "aud": current_user.get('aud')
            },
            "aws_stored_data": {
                "message_id": str(test_message.id),
                "user_id": test_message.user_id,
                "content": test_message.message_content,
                "timestamp": test_message.timestamp.isoformat()
            }
        }
    except Exception as e:
        return {"error": f"Real auth test failed: {str(e)}"}

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
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create a new chat message"""
    # Use authenticated user ID from Supabase
    authenticated_user_id = current_user["user_id"]
    
    message = ChatMessage(
        session_id=session_id,
        message_type=message_type,
        message_content=message_content,
        thread_id=thread_id,
        user_id=authenticated_user_id,  # Use Supabase user ID
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
    page_context: Optional[Dict[str, Any]] = None

class ChatOut(BaseModel):
    reply: str
    thread_id: str

@app.post("/chat", response_model=ChatOut)
def chat(payload: ChatIn, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Chat endpoint with authentication and database storage"""
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI client not configured")
    
    # Create or reuse a thread
    thread_id = payload.thread_id or str(uuid4())
    
    # Simple conversation without session management for now
    messages = [
        {"role": "system", "content": "You are a helpful AI assistant. You can answer questions about medical topics, general knowledge, current events, and provide practical information. Be helpful and informative in your responses."}
    ]
    
    messages.append({"role": "user", "content": payload.message})
    
    try:
        # Use the correct OpenAI model
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500
        )
        
        reply = response.choices[0].message.content
        
        # Store the chat message in database with real user ID
        try:
            # First create a user session if it doesn't exist
            existing_session = db.query(UserSession).filter(UserSession.session_id == thread_id).first()
            if not existing_session:
                user_session = UserSession(
                    session_id=thread_id,
                    user_id=current_user["user_id"],
                    is_active=True
                )
                db.add(user_session)
                db.commit()
            
            # Store the chat message
            chat_message = ChatMessage(
                session_id=thread_id,
                message_type="user",
                message_content={"message": payload.message},
                user_id=current_user["user_id"],
                response_time_ms=100,  # Placeholder
                message_length=len(payload.message)
            )
            
            db.add(chat_message)
            db.commit()
            
        except Exception as db_error:
            # Log the error but don't fail the chat
            print(f"Database storage error: {db_error}")
        
        return ChatOut(reply=reply, thread_id=thread_id)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@app.post("/chat-test", response_model=ChatOut)
def chat_test(payload: ChatIn, db: Session = Depends(get_db)):
    """Test chat endpoint without authentication"""
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI client not configured")
    
    # Create or reuse a thread
    thread_id = payload.thread_id or str(uuid4())
    
    # Simple conversation without session management for now
    messages = [
        {"role": "system", "content": "You are a helpful AI assistant. You can answer questions about medical topics, general knowledge, current events, and provide practical information. Be helpful and informative in your responses."}
    ]
    
    messages.append({"role": "user", "content": payload.message})
    
    try:
        # Use the correct OpenAI model
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500
        )
        
        reply = response.choices[0].message.content
        
        # For now, just return the response without storing in database
        # to avoid foreign key constraint issues
        
        return ChatOut(reply=reply, thread_id=thread_id)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

# File Upload Endpoints
@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and process a file (PDF, DOCX, TXT) for RAG"""
    
    # Validate file type
    allowed_types = ["pdf", "docx", "doc", "txt"]
    file_extension = file.filename.split('.')[-1].lower() if '.' in file.filename else ""
    
    if file_extension not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_types)}"
        )
    
    # Read file content
    try:
        file_content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")
    
    # Generate unique file path
    file_id = str(uuid4())
    s3_key = f"uploads/{current_user['user_id']}/{file_id}_{file.filename}"
    
    # Upload to S3 (if configured)
    s3_url = None
    if s3_client:
        try:
            s3_client.put_object(
                Bucket=S3_BUCKET_NAME,
                Key=s3_key,
                Body=file_content,
                ContentType=file.content_type or "application/octet-stream"
            )
            s3_url = f"s3://{S3_BUCKET_NAME}/{s3_key}"
        except Exception as e:
            print(f"S3 upload failed: {e}")
            # Continue without S3 storage for now
    
    # Extract text from file
    try:
        extracted_text = extract_text_from_file(file_content, file_extension)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")
    
    # Create material record in database
    material = Material(
        user_id=current_user['user_id'],
        title=file.filename,
        file_type=file_extension,
        file_path=s3_url,
        file_size=len(file_content),
        status="processing",
        processing_progress=0
    )
    
    db.add(material)
    db.commit()
    db.refresh(material)
    
    # Process text for RAG (chunk and create embeddings)
    try:
        chunks = chunk_text(extracted_text)
        
        # Create vector index entries for each chunk
        for i, chunk in enumerate(chunks):
            try:
                embedding = generate_embeddings(chunk)
                
                vector_entry = VectorIndexEntry(
                    user_id=current_user['user_id'],
                    content_hash=f"{file_id}_{i}",
                    embedding=embedding,
                    content=chunk,
                    token_count=len(chunk.split()),  # Approximate token count
                    chunk_index=i,
                    source_type="material",
                    source_id=material.id,
                    embedding_model="text-embedding-3-small",
                    vector_metadata={
                        "file_name": file.filename,
                        "chunk_index": i,
                        "total_chunks": len(chunks),
                        "file_type": file_extension,
                        "file_size": len(file_content)
                    }
                )
                
                db.add(vector_entry)
                
            except Exception as e:
                print(f"Error creating embedding for chunk {i}: {e}")
                continue
        
        db.commit()
        
        # Update material status
        material.status = "processed"
        material.processing_progress = 100
        material.chunk_count = len(chunks)
        material.total_tokens = sum(len(chunk.split()) for chunk in chunks)
        material.extracted_text = extracted_text
        material.processed_at = func.now()
        db.commit()
        
        return {
            "success": True,
            "material_id": material.id,
            "file_name": file.filename,
            "file_type": file_extension,
            "chunks_created": len(chunks),
            "text_length": len(extracted_text),
            "s3_url": s3_url,
            "message": f"File processed successfully. Created {len(chunks)} chunks for RAG."
        }
        
    except Exception as e:
        # Update material status to failed
        material.status = "failed"
        material.processing_error = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Error processing file for RAG: {str(e)}")

@app.get("/api/materials")
def get_user_materials(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all materials uploaded by the current user"""
    
    materials = db.query(Material).filter(
        Material.user_id == current_user['user_id']
    ).order_by(Material.uploaded_at.desc()).all()
    
    return {
        "materials": [
            {
                "id": material.id,
                "title": material.title,
                "file_type": material.file_type,
                "status": material.status,
                "processing_progress": material.processing_progress,
                "uploaded_at": material.uploaded_at.isoformat(),
                "processed_at": material.processed_at.isoformat() if material.processed_at else None
            }
            for material in materials
        ]
    }

@app.delete("/api/materials/{material_id}")
def delete_material(
    material_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a material and its associated vector entries"""
    
    # Find the material
    material = db.query(Material).filter(
        Material.id == material_id,
        Material.user_id == current_user['user_id']
    ).first()
    
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    # Delete associated vector entries
    vector_entries = db.query(VectorIndexEntry).filter(
        VectorIndexEntry.source_id == material_id,
        VectorIndexEntry.source_type == "material"
    ).all()
    
    for entry in vector_entries:
        db.delete(entry)
    
    # Delete the material
    db.delete(material)
    db.commit()
    
    return {"success": True, "message": "Material deleted successfully"}

@app.get("/api/search")
def search_materials(
    query: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 5
):
    """Search through user's materials using vector similarity"""
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI client not configured")
    
    try:
        # Generate embedding for the query
        query_embedding = generate_embeddings(query)
        
        # Get user's materials
        user_materials = db.query(Material).filter(
            Material.user_id == current_user['user_id'],
            Material.status == "processed"
        ).all()
        
        material_ids = [m.id for m in user_materials]
        
        if not material_ids:
            return {"results": [], "message": "No processed materials found"}
        
        # Get vector entries for user's materials
        vector_entries = db.query(VectorIndexEntry).filter(
            VectorIndexEntry.source_id.in_(material_ids),
            VectorIndexEntry.source_type == "material"
        ).all()
        
        # Calculate similarity scores (simplified cosine similarity)
        results = []
        for entry in vector_entries:
            # Simple dot product for similarity (in production, use proper cosine similarity)
            similarity = sum(a * b for a, b in zip(query_embedding, entry.embedding))
            results.append({
                "content": entry.content,
                "similarity": similarity,
                "metadata": entry.vector_metadata,
                "source_id": entry.source_id
            })
        
        # Sort by similarity and return top results
        results.sort(key=lambda x: x["similarity"], reverse=True)
        
        return {
            "results": results[:limit],
            "query": query,
            "total_found": len(results)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

@app.post("/chat-rag", response_model=ChatOut)
def chat_with_rag(payload: ChatIn, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Enhanced chat endpoint with RAG integration - searches user's materials for relevant context"""
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI client not configured")
    
    # Create or reuse a thread
    thread_id = payload.thread_id or str(uuid4())
    
    # RAG: Search user's materials for relevant context
    relevant_context = ""
    try:
        # Generate embedding for the user's question
        query_embedding = generate_embeddings(payload.message)
        
        # Get user's processed materials
        user_materials = db.query(Material).filter(
            Material.user_id == current_user['user_id'],
            Material.status == "processed"
        ).all()
        
        if user_materials:
            material_ids = [m.id for m in user_materials]
            
            # Get vector entries for user's materials
            vector_entries = db.query(VectorIndexEntry).filter(
                VectorIndexEntry.source_id.in_(material_ids),
                VectorIndexEntry.source_type == "material",
                VectorIndexEntry.user_id == current_user['user_id']
            ).all()
            
            # Calculate similarity scores and get top results
            results = []
            for entry in vector_entries:
                similarity = sum(a * b for a, b in zip(query_embedding, entry.embedding))
                results.append({
                    "content": entry.content,
                    "similarity": similarity,
                    "metadata": entry.vector_metadata
                })
            
            # Sort by similarity and get top 3 most relevant chunks
            results.sort(key=lambda x: x["similarity"], reverse=True)
            top_results = results[:3]
            
            if top_results:
                relevant_context = "\n\nRelevant information from your uploaded materials:\n"
                for i, result in enumerate(top_results, 1):
                    file_name = result["metadata"].get("file_name", "Unknown")
                    relevant_context += f"\n{i}. From {file_name}:\n{result['content'][:500]}...\n"
                
                # Update access tracking
                for entry in vector_entries:
                    if any(entry.content == result["content"] for result in top_results):
                        entry.last_accessed = func.now()
                        entry.access_count += 1
                db.commit()
    
    except Exception as e:
        print(f"RAG search error: {e}")
        # Continue without RAG context if search fails
    
    # Build messages with RAG context
    system_prompt = f"""You are a helpful AI assistant for Clyvara, a medical education platform. You can answer questions about medical topics, general knowledge, current events, and provide practical information.

{relevant_context}

When referencing information from uploaded materials, mention the source file name. Be helpful and informative in your responses."""
    
    messages = [
        {"role": "system", "content": system_prompt}
    ]
    
    messages.append({"role": "user", "content": payload.message})
    
    try:
        # Use the correct OpenAI model
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500
        )
        
        reply = response.choices[0].message.content
        
        # Store the chat message in database
        try:
            # First create a user session if it doesn't exist
            existing_session = db.query(UserSession).filter(UserSession.session_id == thread_id).first()
            if not existing_session:
                user_session = UserSession(
                    session_id=thread_id,
                    user_id=current_user['user_id'],
                    is_active=True
                )
                db.add(user_session)
                db.commit()
            
            # Store the chat message
            chat_message = ChatMessage(
                session_id=thread_id,
                message_type="user",
                message_content={"message": payload.message},
                user_id=current_user['user_id'],
                response_time_ms=100,  # Placeholder
                message_length=len(payload.message)
            )
            
            db.add(chat_message)
            db.commit()
            
        except Exception as db_error:
            # Log the error but don't fail the chat
            print(f"Database storage error: {db_error}")
        
        return ChatOut(reply=reply, thread_id=thread_id)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
