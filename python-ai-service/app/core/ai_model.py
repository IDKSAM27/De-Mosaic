# app/core/ai_model.py
from PIL import Image
import torch
from transformers import pipeline

class InpaintingModel:
    """
    A singleton class to manage the lifecycle of the AI model.
    It ensures the model is loaded only once.
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(InpaintingModel, cls).__new__(cls)
        return cls._instance

    def __init__(self, model_name="runwayml/stable-diffusion-inpainting"):
        """
        Initializes and loads the inpainting pipeline from Hugging Face.
        This runs only on the first instantiation.
        """
        if not hasattr(self, 'pipe'):  # Ensure initialization happens only once
            print("Initializing AI model... This may take a moment.")
            device = "cuda" if torch.cuda.is_available() else "cpu"
            print(f"Using device: {device}")
            
            self.pipe = pipeline(
                "image-to-image",
                model=model_name,
                torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            )
            
            if device == "cuda":
                self.pipe.to(device)
            
            print("AI model loaded successfully.")

    def run_inference(self, image: Image.Image, mask_image: Image.Image) -> Image.Image:
        """
        Runs the inpainting model on a given image and mask.

        Args:
            image (Image.Image): The original image with mosaic.
            mask_image (Image.Image): A black and white mask where white indicates the area to inpaint.

        Returns:
            Image.Image: The reconstructed (inpainted) image.
        """
        # The prompt guides the AI on what to generate.
        # A generic but effective prompt for photo-realism.
        prompt = "A high-resolution photograph, professionally restored, 4k"
        
        # The model returns a list of images, we take the first one.
        result_image = self.pipe(
            prompt=prompt, image=image, mask_image=mask_image
        ).images[0]
        
        return result_image

# Create the singleton instance that will be imported by other modules
inpainting_model = InpaintingModel()
