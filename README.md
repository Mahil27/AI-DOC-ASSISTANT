# 📄 DocAI — AI Document Assistant  

A professional **AI-powered Document Assistant Website** that allows users to upload any document (PDF/DOCX) and instantly chat with it using advanced NLP + Retrieval Augmented Generation (RAG).

---

## 🌟 Live Project Links  

### ✅ Frontend (GitHub Pages)  
🔗 https://mahil27.github.io/AI-DOC-ASSISTANT/

### ✅ Backend API (Hugging Face Spaces)  
🔗 https://Mahil27-ai-document-assistant.hf.space/docs  

---

## 🚀 What is DocAI?

DocAI is built to help companies and individuals quickly extract insights from documents such as:

- 📑 Resume & CVs  
- 🏥 Medical Reports  
- 💰 Financial Statements  
- 📃 Offer Letters & Contracts  
- 📚 Any PDF/DOCX document  

Upload → Ask Questions → Get Accurate Answers.

---

## ✨ Key Features  

✅ Upload PDF/DOCX documents  
✅ AI chatbot answers only from uploaded document  
✅ RAG-based document search (No hallucination)  
✅ Clean ChatGPT-style UI  
✅ Shows active uploaded document name  
✅ Fast embeddings + retrieval using FAISS  
✅ Fully deployed online (Frontend + Backend)

---

## 🧠 AI Working Pipeline  

```text
Document Upload  
      ↓  
Text Extraction (PDF/DOCX)  
      ↓  
Chunking + Embeddings  
      ↓  
FAISS Vector Index  
      ↓  
User Question  
      ↓  
Relevant Context Retrieval  
      ↓  
LLM Answer Generation (Grounded Response)

# 📄 DocAI — AI Document Assistant  

A professional **AI-powered Document Assistant Website** that allows users to upload any document (PDF/DOCX) and instantly chat with it using advanced NLP + Retrieval Augmented Generation (RAG).

---

## 🌟 Live Project Links  

### ✅ Frontend (GitHub Pages)  
🔗 https://mahil27.github.io/AI-DOC-ASSISTANT/

### ✅ Backend API (Hugging Face Spaces)  
🔗 https://Mahil27-ai-document-assistant.hf.space/docs  

---

## 🚀 What is DocAI?

DocAI is built to help companies and individuals quickly extract insights from documents such as:

- 📑 Resume & CVs  
- 🏥 Medical Reports  
- 💰 Financial Statements  
- 📃 Offer Letters & Contracts  
- 📚 Any PDF/DOCX document  

Upload → Ask Questions → Get Accurate Answers.

---

## ✨ Key Features  

✅ Upload PDF/DOCX documents  
✅ AI chatbot answers only from uploaded document  
✅ RAG-based document search (No hallucination)  
✅ Clean ChatGPT-style UI  
✅ Shows active uploaded document name  
✅ Fast embeddings + retrieval using FAISS  
✅ Fully deployed online (Frontend + Backend)

---

## 🧠 AI Working Pipeline  

```text
Document Upload  
      ↓  
Text Extraction (PDF/DOCX)  
      ↓  
Chunking + Embeddings  
      ↓  
FAISS Vector Index  
      ↓  
User Question  
      ↓  
Relevant Context Retrieval  
      ↓  
LLM Answer Generation (Grounded Response)
🛠️ Tech Stack
🎨 Frontend

HTML5

CSS3

JavaScript (Fetch API)

⚡ Backend

FastAPI

Uvicorn

PyPDF2

python-docx

Sentence Transformers

FAISS Vector Search

🌍 Deployment

GitHub Pages → Frontend Hosting

Hugging Face Spaces → Backend Hosting (Docker)

🔥 API Endpoints
Method	Endpoint	Description
POST	/upload	Upload + Index Document
POST	/chat	Ask Questions from Document
GET	/docs	Swagger API Documentation
🧑‍💻 Run Locally (Optional)
1️⃣ Backend Setup
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload


Backend will start at:

http://127.0.0.1:8000

2️⃣ Frontend Setup

Open directly:

frontend/index.html


Or use VS Code Live Server.

🌍 Deployment Guide
✅ Deploy Frontend on GitHub Pages

Push your code to GitHub

Go to:

Repo → Settings → Pages


Select:

Branch: main

Folder: /root

Save → Website becomes live.

✅ Deploy Backend on Hugging Face Spaces

Create a Docker Space

Upload backend code + Dockerfile

Push:

git push hf main


Backend will run at:

https://<username>-<space>.hf.space

⚠️ Important Notes

GitHub Pages never sleeps

Hugging Face backend may sleep in free tier

Use monitoring tools like UptimeRobot to keep backend awake

👨‍💻 Author
Mahil

AI / ML Developer
Project: DocAI — AI Document Assistant
