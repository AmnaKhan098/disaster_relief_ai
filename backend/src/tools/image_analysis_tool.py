# src/tools/image_analysis_tool.py
import os
from langchain.tools import tool
from src.image_analysis.segmentation_model import segmentation_model
from src.image_analysis.image_segmentation import image_segmentation
from src.image_analysis.mask_analysis import analyze_image
from PIL import Image

@tool
def run_full_damage_analysis(image_folder: str) -> list:
    """
    Runs the complete image segmentation and damage analysis pipeline on a given folder.
    Returns a list of dictionaries with the analysis results for each image.
    """
    print("Loading SegFormer Model...")
    model, extractor = segmentation_model()

    print("Preparing image data...")
    image_data = []
    for f in os.listdir(image_folder):
        if f.lower().endswith((".png", ".jpg", ".jpeg")):
            image_path = os.path.join(image_folder, f)
            image_data.append({"image_path": image_path})

    print("Generating Segmentation Masks...")
    processed_segmentation_results = image_segmentation(image_data=image_data, model=model, extractor=extractor)

    print("Performing Damage Analysis...")
    final_results = []
    for item in processed_segmentation_results:
        analysis_result = analyze_image(
            image_path=item["image_path"]
        )
        final_results.append({
            "image_path": item["image_path"],
            "damage_score": analysis_result.damage_score,
            "damage_explanation": analysis_result.damage_explanation,
        })
        
    return final_results