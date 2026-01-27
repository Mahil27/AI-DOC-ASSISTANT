from PyPDF2 import PdfReader
from docx import Document

def load_document(path: str) -> str:
    if path.endswith(".pdf"):
        reader = PdfReader(path)
        return " ".join(page.extract_text() or "" for page in reader.pages)

    if path.endswith(".docx"):
        doc = Document(path)
        return " ".join(p.text for p in doc.paragraphs)

    raise ValueError("Unsupported file type")
