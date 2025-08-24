# app/main.py
from fastapi import FastAPI
from .api import routes

app = FastAPI(
    title="Mosaic Remover AI Service",
    description="A dedicated microservice for AI-based image inpainting.",
    version="1.0.0"
)

# Include the API routes from the 'api' module
app.include_router(routes.router)

@app.get("/", tags=["Root"])
def read_root():
    """A simple endpoint to confirm the service is running."""
    return {"status": "ok", "message": "Welcome to the Mosaic Remover AI Service"}
