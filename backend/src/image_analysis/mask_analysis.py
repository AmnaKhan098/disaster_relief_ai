# src/image_analysis/mask_analysis.py
import os
import base64
from typing import Dict
from langchain.schema.messages import HumanMessage
from langchain.chat_models import init_chat_model
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("Google API Key Not Found")

# Pydantic model for structured output
class DamageAnalysisResult(BaseModel):
  damage_explanation: str = Field(description="An explanation of the damage assessment")
  damage_score: int = Field(description="A score between 0 and 10, where 10 is extremely damaged")

# Initialize the chat model
google_model = init_chat_model(
    model="gemini-2.0-flash",
    model_provider="google_genai",
    api_key=GOOGLE_API_KEY
).with_structured_output(DamageAnalysisResult)

def encode_image_to_base64(image_path: str) -> str:
    """Encodes an image file to a base64 string."""
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")

def analyze_image(image_path: str) -> DamageAnalysisResult:
    """
    Analyzes a single image for damage assessment.

    Args:
        image_path: The path to the image file.

    Returns:
        A DamageAnalysisResult object containing the analysis.
    """
    base64_image = encode_image_to_base64(image_path)

    prompt = f"""
You are a disaster analysis expert.
1. Analyze the image provided.
2. Provide a concise explanation (3-4 sentences) of the visible disaster or damage.
3. Assign a damage score from 0 (no damage) to 10 (extremely damaged).

INSTRUCTIONS:
- Respond only with the requested structured data.
- Your analysis is critical for emergency response, so be accurate.
"""

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{base64_image}"},
            },
        ]
    )

    # The LLM call now directly returns the Pydantic object
    result = google_model.invoke([message])
    return result