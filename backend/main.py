from fastapi import FastAPI, Request
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"blank get request"}


WORDS = ["hello", "pencil", "phone", "light", "computer", "charger"]
@app.get("/randomWord")
def randomWord():
    return {"word": random.choice(WORDS)}


@app.get("/add")
def addingNums(i:int, j:int):
    return {"result": i + j}

@app.post("/items")
async def create_item(item: Dict):
    print("Received from POST:", item)
    return {"json data": item}