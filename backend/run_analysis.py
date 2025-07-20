from src.tools.image_analysis_tool import run_full_damage_analysis
import json
import os
import re
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from src.tools.web_search_tool import search_web

# Configure the API Key (assuming GEMINI_API_KEY is set in the environment)
llm = ChatGroq(model="llama3-70b-8192")

print("---> Executing Damage Analysis <---")
analysis_results = run_full_damage_analysis.invoke({"image_folder": "test_data"})

# Process results to add area name by inferring from filename
processed_analysis_results = []
for item in analysis_results:
    area_name = "N/A"
    # Infer area from image filename
    filename = os.path.basename(item["image_path"])
    event_name_match = re.match(r"([a-zA-Z0-9-]+?)_", filename)
    event_name = event_name_match.group(1) if event_name_match else "Unknown Event"

    if event_name != "Unknown Event":
        print(f"Inferring area for event: {event_name}")
        # Use LLM to get primary affected area
        llm_area_query = f"Given the event name '{event_name}', what was the primary geographical area affected? Respond with only the name of the area, e.g., 'Florida Panhandle'."
        try:
            llm_area_response = llm.invoke([HumanMessage(content=llm_area_query)])
            inferred_area = llm_area_response.content.strip()
            print(f"LLM inferred area: {inferred_area}")

            # Use web search to get general information about the inferred area
            web_search_query = f"General information about {inferred_area}"
            area_search_result = search_web.invoke({"query": web_search_query})
            # Truncate for brevity and clarity in the output
            area_name = f"Inferred Area: {inferred_area}. Web Info: {area_search_result[:200]}..."
            print(f"Web search for inferred area: {area_name}")
        except Exception as e:
            print(f"Error inferring or searching for area name from event: {e}")
            area_name = f"N/A (Error inferring from {event_name})"
    else:
        area_name = "N/A (Unknown Event)"

    processed_analysis_results.append({
        "image_path": item["image_path"],
        "damage_score": item["damage_score"],
        "damage_explanation": item["damage_explanation"],
        "area_name": area_name
    })

print("\n---> Image Analysis Results (with Area Name) <---")
print(json.dumps(processed_analysis_results, indent=2))

# 2. Format results for the evaluator prompt
all_images_info = json.dumps(processed_analysis_results, indent=2)

# 3. Build the complete prompt for the evaluator agent
evaluator_prompt_template = f"""You are a disaster evaluator. Below are image analyses with damage scores (0 to 10), explanations, and area names.
Choose which area/image represents the **most urgent situation** based on the information provided. Use the area name to enrich your understanding and refine the damage assessment, damage score, and justification.
Return a JSON object with the following keys:
- "area_name": Name of the area selected
- "damage_score": Damage score (potentially refined based on web context)
- "original_explanation": Original explanation
- "justification": Justification for the choice, incorporating insights from the area name and web context.
- "image_path": Original image path (for reference, not for display in final output)

{all_images_info}
"""

print("\n---> Generated Prompt for Evaluator Agent <---")
print(evaluator_prompt_template)

# 4. Execute the evaluator agent (Gemini 1.5 Flash LLM)
print("\n---> Executing Evaluator Agent (Gemini 1.5 Flash LLM) <---")

try:
    response = llm.invoke([HumanMessage(content=evaluator_prompt_template)])
    llm_output = response.content
    print("\n---> Raw LLM Response <---")
    print(llm_output)

    # Try to parse the LLM's JSON response
    try:
        urgent_situation = json.loads(llm_output)
        print("\n---> Evaluator Agent Decision (LLM) <---")
        print(f"Selected Area Name: {urgent_situation.get("area_name", "N/A")}")
        print(f"Damage Score: {urgent_situation.get("damage_score", "N/A")}")
        print(f"Original Explanation: {urgent_situation.get("original_explanation", "N/A")}")
        print(f"Justification for Choice: {urgent_situation.get("justification", "N/A")}")
    except json.JSONDecodeError:
        print("\nError parsing LLM JSON response. Response is not in the expected format.")
        print(f"LLM Response: {llm_output}")

except Exception as e:
    print(f"\nError calling LLM: {e}")
    print("Please ensure that the GROQ_API_KEY, GOOGLE_API_KEY, and GOOGLE_CSE_ID environment variables are correctly configured.")

