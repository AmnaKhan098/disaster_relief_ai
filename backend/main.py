import os
import re
import json

import langchain

from fastapi import FastAPI, File, UploadFile, HTTPException


from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

from src.tools.image_analysis_tool import run_full_damage_analysis
from src.tools.web_search_tool import search_web

from dotenv import load_dotenv
load_dotenv()


class EvaluatorDecision(BaseModel):
    area_name: str = Field(..., description="Name of the area selected")
    damage_score: float = Field(..., description="Damage score (potentially refined based on web context)", ge=0, le=10)
    original_explanation: str = Field(..., description="Original explanation")
    justification: str = Field(..., description="Justification for the choice, incorporating insights from the area name and web context")
    image_path: str = Field(..., description="Original image path (for reference, not for display in final output)")


# Configure the API Key (assuming GEMINI_API_KEY is set in the environment)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest")

def analyze_damage(image_folder):
    try:
        print("---> Executing Damage Analysis <---")
        analysis_results = run_full_damage_analysis.invoke({"image_folder": image_folder})

        processed_analysis_results = []

        for item in analysis_results:
            area_name = "N/A"
            filename = os.path.basename(item["image_path"])
            event_name_match = re.match(r"([a-zA-Z0-9-]+?)_", filename)
            event_name = event_name_match.group(1) if event_name_match else "Unknown Event"

            if event_name != "Unknown Event":
                llm_area_query = f"Given the event name '{event_name}', what was the primary geographical area affected? Respond with only the name of the area, e.g., 'Florida Panhandle'."
                try:
                    llm_area_response = llm.invoke([HumanMessage(content=llm_area_query)])
                    inferred_area = llm_area_response.content.strip()

                    web_search_query = f"General information about {inferred_area}"
                    area_search_result = search_web.invoke({"query": web_search_query})
                    area_name = f"Inferred Area: {inferred_area}. Web Info: {area_search_result[:200]}..."
                except Exception as e:
                    area_name = f"N/A (Error inferring from {event_name})"
            else:
                area_name = "N/A (Unknown Event)"

            processed_analysis_results.append({
                "image_path": item["image_path"],
                "damage_score": item["damage_score"],
                "damage_explanation": item["damage_explanation"],
                "area_name": area_name
            })

        # Format for evaluator
        all_images_info = json.dumps(processed_analysis_results, indent=2)

        evaluator_prompt_template = f"""You are a disaster evaluator. 
        Below are image analyses with damage scores (0 to 10), explanations, and area names.
Choose which area/image represents the **most urgent situation** based on the information provided. 
Use the area name to enrich your understanding and refine the damage assessment, damage score, and justification.

{all_images_info}
"""

        try:
            model = llm.with_structured_output(EvaluatorDecision)
            llm_output = model.invoke([HumanMessage(content=evaluator_prompt_template)])
            
            try:
                urgent_situation = llm_output.model_dump()
                return {
                    "evaluator_decision": urgent_situation,
                    "detailed_analysis": processed_analysis_results
                }
            except json.JSONDecodeError:
                raise Exception(f"LLM response is not valid JSON: {llm_output}")

        except Exception as e:
            raise Exception(f"LLM Error: {str(e)}")

    except Exception as e:
        raise Exception(f"Internal Error: {str(e)}")

