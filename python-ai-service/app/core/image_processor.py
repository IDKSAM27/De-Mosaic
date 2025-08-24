# app/core/image_processor.py
from PIL import Image
import cv2
import numpy as np
from .ai_model import inpainting_model
import os

def detect_mosaic_area(image_path: str) -> Image.Image:
    """
    Identifies the mosaic/pixelated area in an image and returns a mask.
    
    NOTE: This is a placeholder for a more advanced algorithm. A real-world
    implementation would use techniques like frequency analysis (e.g., Fourier
    transform) or a trained classifier to find pixelated blocks.

    For this project, we'll use a simple edge-detection and contouring
    method that works for sharp, blocky mosaics.
    """
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Use Canny edge detection to find sharp edges, typical of mosaic blocks
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    
    # Find contours from the edges
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Create a blank mask
    h, w = img.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)
    
    # Filter contours based on area to find plausible mosaic regions
    for cnt in contours:
        if cv2.contourArea(cnt) > 1000: # Heuristic: filter small noise
            # Get the bounding rectangle and draw it on the mask
            x, y, w_rect, h_rect = cv2.boundingRect(cnt)
            cv2.rectangle(mask, (x, y), (x + w_rect, y + h_rect), 255, -1)
            
    # If no contours were found, fall back to a center mask for demonstration
    if np.sum(mask) == 0:
        start_x, end_x = w // 4, w - (w // 4)
        start_y, end_y = h // 4, h - (h // 4)
        cv2.rectangle(mask, (start_x, start_y), (end_x, end_y), 255, -1)

    return Image.fromarray(mask)


def remove_mosaic_from_image(image_path: str) -> str:
    """
    Orchestrates the full mosaic removal pipeline for a single image.
    1. Loads the image.
    2. Detects the mosaic area to create a mask.
    3. Calls the AI model to perform inpainting.
    4. Saves the final result.
    
    Returns:
        str: The file path of the processed output image.
    """
    print(f"Processing image: {image_path}")
    
    # 1. Load the image using PIL
    original_image = Image.open(image_path).convert("RGB")
    
    # 2. Detect the mosaic area to generate a mask
    print("Detecting mosaic area...")
    mask_image = detect_mosaic_area(image_path)
    
    # 3. Use the AI model service to inpaint the masked area
    print("Running AI inpainting model...")
    processed_image = inpainting_model.run_inference(original_image, mask_image)
    
    # 4. Save the result to a predictable output path
    output_dir = "processed_files"
    os.makedirs(output_dir, exist_ok=True)
    
    base_filename = os.path.basename(image_path)
    output_path = os.path.join(output_dir, f"processed_{base_filename}")
    
    processed_image.save(output_path)
    print(f"Saved processed image to: {output_path}")
    
    return output_path
