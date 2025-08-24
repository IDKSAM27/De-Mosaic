<br/>
<h1 align="center">De-Mosaic</h1>

<p align="center">
  Ever found a great image, only to have it ruined by blocky mosaic censorship? This project is on a mission to fix that. Using the magic of generative AI, De-Mosaic intelligently reconstructs what's behind the pixels, restoring images as if the censorship was never there.
  <br/>
  <br/>
  <a href="#-how-it-works"><strong>How It Works »</strong></a>
  <br/>
  <br/>
  ·
  <a href="https://github.com/IDKSAM27/De-Mosaic/issues">Report a Bug</a>
  ·
  <a href="https://github.com/IDKSAM27/De-Mosaic/issues">Request a Feature</a>
</p>

<p align="center">
  <img src="https://your-demo-gif-url-here.com/demo.gif" alt="Project Demo GIF">
</p>

## About The Project

De-Mosaic isn't just another image tool; it's an exploration into the power of AI-driven image restoration. The goal is to take a mosaicked image—where information has been lost—and use a sophisticated AI model to make a smart, context-aware guess to fill in the blanks. The result is a seamless, natural-looking image.

This project was built with a modern, professional tech stack to ensure it's not only powerful but also fast, scalable, and a great learning experience.

**Built With:**
*   **Frontend:** [Next.js](https://nextjs.org/) & [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **API Layer:** [tRPC](https://trpc.io/)
*   **AI Backend:** A dedicated [Python](https://www.python.org/) microservice with [FastAPI](https://fastapi.tiangolo.com/)
*   **The Brains:** [Stable Diffusion](https://stability.ai/) via the [Diffusers](https://huggingface.co/docs/diffusers/index) library

## Getting Started

Want to run this on your own machine? Follow these simple steps to get the project up and running.

### Prerequisites

You'll need `npm` (for the frontend) and `Python` (for the AI service) installed on your system.

*   npm
    ```
    npm install npm@latest -g
    ```
*   Python & Pip
    ```
    # Ensure you have Python 3.8+ installed
    ```

### Installation

1.  **Clone the repository:**
    ```
    git clone https://github.com/IDKSAM27/De-Mosaic.git
    cd De-Mosaic
    ```

2.  **Set up the Python AI Service:**
    ```
    cd python-ai-service
    python -m venv .venv
    source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
    pip install -r requirements.txt
    ```

3.  **Set up the T3 Frontend:**
    ```
    cd ../t3-frontend
    npm install
    ```

### Running the Application

You'll need to run both the frontend and the AI service in separate terminal windows.

1.  **Start the AI Service:**
    *   In the `python-ai-service` directory:
    ```
    uvicorn app.main:app --reload
    ```
    *(The first time you run this, it will download the multi-gigabyte AI model. This is a one-time process!)*

2.  **Start the Frontend:**
    *   In the `t3-frontend` directory:
    ```
    npm run dev
    ```

Open your browser and navigate to `http://localhost:3000` to see the magic happen!

## How It Works

This project uses a modern microservice architecture, which separates the user interface from the heavy AI processing.

1.  **The Frontend (Next.js):** You upload an image through our sleek, responsive web interface.
2.  **The API Proxy (tRPC):** The Next.js server takes your image and forwards it to our AI powerhouse.
3.  **The AI Microservice (Python/FastAPI):** This is where the real work happens.
    *   The service receives the image.
    *   An algorithm detects the mosaicked areas to create a "mask".
    *   The powerful Stable Diffusion inpainting model receives the original image and the mask.
    *   The AI "dreams" up the missing pixels based on the surrounding context and its vast training knowledge.
4.  **The Result:** The beautifully restored image is sent back to you in the browser, all in one seamless flow.

## Future Roadmap

This is just the beginning! Here are some ideas for the future:
*   [ ] Fine-tune a custom model for specific image genres (e.g., illustrations, old photographs).
*   [ ] Add PDF support to extract and restore images from documents.
*   [ ] Deploy the AI service on a serverless GPU platform like Replicate for lightning-fast public inference.
*   [ ] Allow users to "brush" over the mosaic area manually for more control.

See the [open issues](https://github.com/IDKSAM27/De-Mosaic/issues) for a full list of proposed features (and known issues).

## Acknowledgements

A huge thank you to the teams and communities behind these incredible open-source tools that made this project possible:
*   [Hugging Face](https://huggingface.co/) for democratizing AI.
*   [Stability AI](https://stability.ai/) for the powerful models.
*   [T3 Stack](https://create.t3.gg/) for a fantastic developer experience.

---
*This project is intended for educational and ethical use only, to explore the capabilities of generative AI in image restoration.*
