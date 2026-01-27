import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ChatRequest
from app.document_loader import load_document
from app.vector_store import VectorStore
from app.rag import generate_chat_answer
from app.config import EMBEDDING_MODEL


# =========================
# FASTAPI APP
# =========================

app = FastAPI()
@app.get("/")
def home():
    return {
        "message": "✅ DocAI Backend is running successfully!",
        "endpoints": {
            "upload": "/upload",
            "chat": "/chat"
        }
    }

# =========================
# CORS (REQUIRED FOR FRONTEND)
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # allow frontend from any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# GLOBAL STATE
# =========================

vector_store = VectorStore(EMBEDDING_MODEL)
chat_history = []

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================
# UTILS
# =========================

def chunk_text(text, size=500):
    return [text[i:i + size] for i in range(0, len(text), size)]


# =========================
# ROUTES
# =========================

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    global chat_history

    # reset chat history for new document
    chat_history = []

    # save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # load & process document
    text = load_document(file_path)
    chunks = chunk_text(text)

    # build vector index
    vector_store.build(chunks)

    # logs for debugging
    print("✅ DOCUMENT INDEXED")
    print(f"✅ Document name: {file.filename}")
    print(f"✅ Total chunks: {len(chunks)}")
    print(f"✅ Index exists? {vector_store.index is not None}")

    return {
        "message": "Document uploaded and indexed successfully",
        "document_name": file.filename
    }


@app.post("/chat")
async def chat(request: ChatRequest):

    print("📌 CHAT CALLED")
    print(f"📌 Index exists? {vector_store.index is not None}")

    # guard: no document uploaded
    if vector_store.index is None:
        return {
            "answer": "❌ Please upload a document before asking questions."
        }

    # retrieve relevant context
    relevant_chunks = vector_store.search(request.question)
    context = "\n".join(relevant_chunks)

    if not context.strip():
        return {
            "answer": "❌ Information not found in the uploaded document."
        }

    # generate answer using RAG
    answer = generate_chat_answer(
        context=context,
        chat_history=chat_history,
        question=request.question
    )

    # save conversation history
    chat_history.append({
        "user": request.question,
        "assistant": answer
    })

    return {
        "answer": answer
    }
