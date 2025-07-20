from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
import re
import json

from fastapi.responses import JSONResponse
import zipfile
import os
import uuid
import shutil

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

from src.tools.image_analysis_tool import run_full_damage_analysis
from src.tools.web_search_tool import search_web

from main import analyze_damage
from utils.utils import download_supabase_images

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

class FolderData(BaseModel):
    folder_path: str
    user_id: str 

@app.post("/folder-path")
async def analyze_damage_endpoint(data: FolderData):

    image_path = download_supabase_images(data.folder_path)

    analysis = analyze_damage(image_path)
    analysis["evaluator_decision"]["image_name"] = analysis["evaluator_decision"]["image_path"].split("/")[-1]

    return {
        "message": analysis["evaluator_decision"]
    }

