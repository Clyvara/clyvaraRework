from fastapi import FastAPI, Request
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
from uuid import uuid4
import random

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
)

#----------------------------------------------------

# def chatbot():

#     current_response_id = None

#     while True:
#         prompt = input("You: ")
#         if prompt.lower() in ['exit', 'bye', 'quit']:
#             print("Bye!")
#             break

#         response = client.responses.create(
#             model="gpt-5-nano", 
#             input=prompt, 
#             previous_response_id=current_response_id
#         )
        
#         current_response_id = response.id

#         print('RESPONSE:', response.output_text)

#----------------------------------------------------

@app.get("/")
def root():
    return {"blank get request"}

# #TESTING GET REQUEST
# WORDS = ["hello", "pencil", "phone", "light", "computer", "charger"]
# @app.get("/randomWord")
# def randomWord():
#     return {"word": random.choice(WORDS)}

@app.post("/items")
async def create_item(item: Dict):
    print("Received from POST:", item)
    return {"json data": item}

#--------------------------------------------
#Chatbot Setup

SESSIONS: Dict[str, Optional[str]] = {}

class ChatIn(BaseModel):
    message: str
    thread_id: Optional[str] = None  

class ChatOut(BaseModel):
    reply: str
    thread_id: str

@app.post("/chat", response_model=ChatOut)
def chat(payload: ChatIn):
    # create or reuse a thread
    thread_id = payload.thread_id or str(uuid4())
    prev = SESSIONS.get(thread_id)

    resp = client.responses.create(
        model="gpt-5-nano",
        input=payload.message,
        previous_response_id=prev,
    )
    SESSIONS[thread_id] = resp.id

    return ChatOut(reply=resp.output_text, thread_id=thread_id)