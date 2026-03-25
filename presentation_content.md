# Presentation Content (10-12 Slides)

**Slide 1: Title**
- AI-Powered Insurance Question Answering System
- Built using Fine-Tuned Phi-2 & LoRA
- Prepared by: [Your Name]

**Slide 2: Introduction**
- The complexity of insurance terms.
- Traditional customer support is slow and expensive.
- Solution: A local, smart AI Chatbot tailored for the insurance domain.

**Slide 3: Problem Statement**
- Users are confused by insurance jargon.
- Existing chatbots are rigid and rule-based.
- Cloud-based AI raises privacy concerns for personal data.

**Slide 4: Proposed Solution**
- An NLP-driven QA system specifically trained on insurance data (InsuranceQA).
- Uses Phi-2 (a small but highly capable model).
- Runs locally ensuring data privacy.

**Slide 5: Technical Stack**
- **Model:** Phi-2 fine-tuned with LoRA, exported to GGUF format.
- **Inference:** `llama.cpp` via `llama-cpp-python` for speed.
- **Backend:** FastAPI (Python) for asynchronous API handling.
- **Frontend:** HTML/CSS/JS (ChatGPT-like UI).

**Slide 6: System Architecture**
- *Display the flow diagram (Frontend -> FastAPI -> Model Wrapper -> Hardware).*
- Mention the clean separation of concerns between UI and AI processing.

**Slide 7: Why Phi-2 and GGUF?**
- **Phi-2:** Exceptional reasoning abilities packed into a 2.7B parameter size.
- **GGUF Format:** Allows fast inference on regular CPUs/GPUs without needing massive VRAM.

**Slide 8: User Interface Highlights**
- Modern, minimal, and responsive.
- Dark mode toggle.
- Real-time loading indicators.
- Seamless markdown parsing for structured responses.

**Slide 9: Results & Performance**
- Secure, instantaneous responses.
- Handles complex queries naturally.
- Fallback mock-mode handling guarantees systemic stability even if the model is missing.

**Slide 10: Limitations**
- Bounded by local hardware processing power.
- Model data is static without internet search capabilities.
- Potential hallucinations on out-of-domain queries.

**Slide 11: Future Enhancements**
- Add RAG features to ingest specific user policy PDFs.
- Conversational chat memory.
- Voice-to-Text inputs.

**Slide 12: Conclusion & Q&A**
- Summary of the project.
- Open the floor for questions.

---

# Key Points for Viva (Q&A Preparation)

1. **Why use LoRA?**
   *Answer:* LoRA (Low-Rank Adaptation) vastly reduces the number of trainable parameters, making fine-tuning a large model much faster and less resource-heavy. It freezes original weights and injects smaller trainable matrices instead of mutating the entire model.

2. **Why GGUF format and llama.cpp?**
   *Answer:* Standard Hugging Face model formats require huge RAM/VRAM. GGUF is quantized (compressed) making it possible to run large LLMs perfectly mapped locally on standard laptops efficiently using the highly optimized `llama.cpp` C++ backend.

3. **Why FastAPI instead of Flask?**
   *Answer:* FastAPI is inherently asynchronous, highly performant, handles data validation natively with Pydantic, and creates a fast standard REST API to communicate with our frontend cleanly.

4. **How do you handle errors if the model fails?**
   *Answer:* We wrapped the model loading in try-except blocks. If the model is missing (e.g., file not downloaded), the backend degrades gracefully into a 'Mock Mode' instead of crashing, returning simulated warnings for testing the UI component safely.

---

# Simple Explanation for Beginners

Imagine you have to read a 100-page legal document just to find out if your dentist visit is covered. It's frustrating! 
This project creates a highly intelligent digital assistant. We took a "smart but general" brain (the Phi-2 AI model) and specifically taught it about insurance using thousands of examples (fine-tuning). 

Instead of hosting this brain on a massive expensive computer far away, we squeezed and optimized it (using GGUF format) so it fits on a regular laptop. We then built a beautiful, easy-to-use chatting website (like ChatGPT) that talks to a middle-man application layer (FastAPI), which in turn asks the AI brain the user's questions securely and privately right on their own machine.
