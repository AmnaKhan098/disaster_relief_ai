import os
import torch
import uuid
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
from transformers import SegformerFeatureExtractor, SegformerForSemanticSegmentation

# === CONFIG ===
OUTPUT_ROOT = "outputs"

def image_segmentation(image_data, model, extractor , output_folder=OUTPUT_ROOT):
    # === Utility Functions ===
    def apply_colormap(mask):
        colormap = plt.cm.get_cmap('jet')
        colored_mask = colormap(mask / mask.max())
        return (colored_mask[:, :, :3] * 255).astype(np.uint8)

    def save_outputs(image, mask, overlay, output_dir, filename_base):
        image.save(os.path.join(output_dir, f"{filename_base}_original.png"))
        mask.save(os.path.join(output_dir, f"{filename_base}_mask.png"))
        overlay.save(os.path.join(output_dir, f"{filename_base}_overlay.png"))

    # === Create unique output directory ===
    unique_id = str(uuid.uuid4())[:8]
    output_dir = os.path.join(OUTPUT_ROOT, unique_id)
    os.makedirs(output_dir, exist_ok=True)

    # === Collect image paths ===
    image_paths = [item["image_path"] for item in image_data]

    # === Load and preprocess all images ===
    images = [Image.open(p).convert("RGB") for p in image_paths]
    inputs = extractor(images=images, return_tensors="pt")

    # === Run model inference ===
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    predicted_masks = torch.argmax(logits, dim=1).cpu().numpy()

    def save_composite_figure(image, mask, overlay, output_dir, filename_base):
        fig, axs = plt.subplots(1, 3, figsize=(15, 5))

        axs[0].imshow(image)
        axs[0].set_title("Original")
        axs[0].axis('off')

        axs[1].imshow(mask, cmap='jet')
        axs[1].set_title("Mask")
        axs[1].axis('off')

        axs[2].imshow(overlay)
        axs[2].set_title("Overlay")
        axs[2].axis('off')

        plt.tight_layout()
        fig_path = os.path.join(output_dir, f"{filename_base}_composite.png")
        plt.savefig(fig_path, bbox_inches='tight')
        plt.close()

    # === Processing and saving results ===
    processed_results = []
    for i, image_info in enumerate(image_data):
        image = images[i]
        mask_np = predicted_masks[i]
        resized_mask = Image.fromarray(mask_np.astype(np.uint8)).resize(image.size)

        colored_mask = apply_colormap(np.array(resized_mask))
        overlay = Image.blend(image, Image.fromarray(colored_mask), alpha=0.5)

        filename_base = os.path.splitext(os.path.basename(image_info["image_path"]))[0]
        save_composite_figure(image, resized_mask, overlay, output_dir, filename_base)
        
        processed_results.append({
            "image_path": image_info["image_path"],
            "segmentation_mask_path": os.path.join(output_dir, f"{filename_base}_mask.png") # Example of adding mask path
        })

    print(f"Saved results in: {output_dir}")
    return processed_results
