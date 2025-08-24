# app/core/ai_model.py
from PIL import Image
import torch
# Import the correct pipeline from the diffusers library
from diffusers import AutoPipelineForInpainting

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
        Initializes and loads the inpainting pipeline from Hugging Face
        using the 'diffusers' library.
        """
        if not hasattr(self, 'pipe'):
            print("Initializing AI model with diffusers... This may take a moment.")
            device = "cuda" if torch.cuda.is_available() else "cpu"
            torch_dtype = torch.float16 if device == "cuda" else torch.float32
            print(f"Using device: {device}")

            # Use AutoPipelineForInpainting, which is designed for this task
            self.pipe = AutoPipelineForInpainting.from_pretrained(
                model_name,
                torch_dtype=torch_dtype,
                variant="fp16" if torch_dtype == torch.float16 else None
            )
            
            if device == "cuda":
                self.pipe.to(device)
            
            print("AI model loaded successfully.")

    def run_inference(self, image: Image.Image, mask_image: Image.Image) -> Image.Image:
        """
        Runs the inpainting model on a given image and mask.
        """
        prompt = "photorealistic, 4k, high-resolution, professional photo"
        
        # The diffusers pipeline takes prompt, image, and mask_image directly
        result_image = self.pipe(
            prompt=prompt,
            image=image,
            mask_image=mask_image
        ).images[0]
        
        return result_image

# Create the singleton instance
inpainting_model = InpaintingModel()
