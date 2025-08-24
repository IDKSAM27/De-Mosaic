# app/api/routes.py
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from fastapi.responses import FileResponse
from ..core import image_processor
import shutil
import os

router = APIRouter()

@router.post("/process-image/", tags=["Image Processing"])
async def process_image_endpoint(file: UploadFile = File(...)):
    """
    Receives an image, processes it to remove mosaic using the AI engine,
    and returns the resulting image file.
    """
    # Create a temporary directory to store files if it doesn't exist
    temp_dir = "temp_files"
    os.makedirs(temp_dir, exist_ok=True)
    
    temp_file_path = os.path.join(temp_dir, file.filename)
    
    try:
        # Save the uploaded file to a temporary location
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Delegate the entire processing logic to the image_processor module
        output_path = image_processor.remove_mosaic_from_image(temp_file_path)
        
        # Return the processed file as a response
        return FileResponse(path=output_path, media_type="image/png", filename=f"processed_{file.filename}")

    except Exception as e:
        # If anything goes wrong, return a detailed server error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during image processing: {e}"
        )
    finally:
        # Clean up the temporary input file after processing is complete
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
