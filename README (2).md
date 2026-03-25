# AI-Powered Insurance Question Answering System

An intelligent, visually attractive, and production-quality insurance chatbot powered by a fine-tuned Phi-2 model. It features a modern ChatGPT-like UI, a robust FastAPI backend, and efficient local model inference using `llama.cpp` (via `llama-cpp-python`).

## Features
- **Natural Language QA:** Answers complex insurance-related queries efficiently.
- **Modern UI:** Clean, responsive chat interface with Dark Mode support and loading animations.
- **Fast Local Inference:** Utilizes optimized GGUF format for Phi-2 via `llama.cpp`.

## Project Structure
- `/backend`: Contains the FastAPI application (`main.py`).
- `/frontend`: Contains the HTML, CSS, and JS for the modern chat interface.
- `/model`: Directory where the pre-trained Phi-2 GGUF file should be placed.
- `/utils`: Contains the `model_handler.py` wrapper for model integration.

## Installation Guide (Step-by-Step)

### Prerequisites
1. Python 3.9 to 3.11 installed.
2. Ensure you have a C++ compiler installed if you need to build `llama-cpp-python` from source.

### 1. Clone or Download Project
Navigate to the root directory containing this project.

### 2. Install Dependencies
Open your terminal inside the project root folder and run:
```bash
pip install -r requirements.txt
```

*(Note: Depending on your hardware, you might want to install hardware-accelerated versions of `llama-cpp-python`. Refer to their official documentation for GPU support).*

### 3. Download the Model
1. Download a fine-tuned Phi-2 GGUF model (or the standard Phi-2 GGUF) from Hugging Face.
2. Place the downloaded file (`.gguf` extension) into the `/model` directory.
3. Rename it exactly to `phi-2-insurance.gguf` (or update the filename reference in `utils/model_handler.py`).

### 4. Run the Application
Start the FastAPI server:
```bash
python backend/main.py
```
or alternatively:
```bash
uvicorn backend.main:app --reload
```

The server will start at `http://127.0.0.1:8000`. Navigate to this URL in your web browser to access the Insurance AI Assistant.
