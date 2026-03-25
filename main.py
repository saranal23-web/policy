import os
import sys
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.model_handler import default_handler

app = FastAPI(title="Insurance QA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")

@app.get("/")
async def root():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Frontend not found. Please ensure index.html exists in the frontend folder."}

@app.get("/{filename}")
async def get_static_file(filename: str):
    file_path = os.path.join(FRONTEND_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="File not found")

@app.post("/ask")
async def ask_question(
    question: str = Form(...),
    bank: str = Form("General"),
    file: UploadFile = File(None)
):
    if not question or not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    file_bytes = None
    if file and file.filename:
        # Check if the file is valid
        if not (file.filename.endswith('.pdf') or file.filename.endswith('.txt')):
             raise HTTPException(status_code=400, detail="Only PDF or TXT files are supported.")
        file_bytes = await file.read()
    
    try:
        # Pass the form data and file to model handler
        response_data = default_handler.generate_response(
            question=question, 
            file_bytes=file_bytes,
            bank_name=bank
        )
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Process started
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
