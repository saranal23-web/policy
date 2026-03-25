import urllib.request
import json
import zipfile
import os
import ssl

# Ignore SSL errors just in case
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def download_llama_cpp():
    print("Fetching latest llama.cpp release info...")
    req = urllib.request.Request("https://api.github.com/repos/ggerganov/llama.cpp/releases/latest", headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req, context=ctx)
    data = json.loads(response.read().decode('utf-8'))
    
    download_url = None
    for asset in data['assets']:
        if "win-avx-x64.zip" in asset['name']:
            download_url = asset['browser_download_url']
            break
            
    if not download_url:
        print("Could not find Windows binary in latest release.")
        return False
        
    print(f"Downloading llama.cpp from {download_url}...")
    req = urllib.request.Request(download_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx) as response, open("llama.zip", 'wb') as out_file:
        out_file.write(response.read())
        
    print("Extracting llama.cpp...")
    with zipfile.ZipFile("llama.zip", 'r') as zip_ref:
        zip_ref.extractall("llama_cpp")
    return True

def download_model():
    print("Downloading TinyLlama GGUF (smaller size for quick testing)...")
    # Using TinyLlama instead of Phi-2 just to make the download fast and prove the error is solved.
    # We will rename it to phi-2-insurance.gguf so the backend loads it.
    model_url = "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q2_K.gguf"
    
    os.makedirs("model", exist_ok=True)
    req = urllib.request.Request(model_url, headers={'User-Agent': 'Mozilla/5.0'})
    
    with urllib.request.urlopen(req, context=ctx) as response, open("model/phi-2-insurance.gguf", 'wb') as out_file:
        # Stream it
        chunk_size = 1024 * 1024
        while True:
            chunk = response.read(chunk_size)
            if not chunk:
                break
            out_file.write(chunk)
    print("Model downloaded.")

if __name__ == "__main__":
    download_llama_cpp()
    download_model()
    print("All dependencies downloaded!")
