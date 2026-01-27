import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class VectorStore:
    def __init__(self, model_name: str):
        self.model = SentenceTransformer(model_name)
        self.index = None
        self.text_chunks = []

    def build(self, chunks):
        self.text_chunks = chunks
        embeddings = self.model.encode(chunks)
        self.index = faiss.IndexFlatL2(embeddings.shape[1])
        self.index.add(np.array(embeddings))

    def search(self, query, k=5):
        query_embedding = self.model.encode([query])
        _, idx = self.index.search(np.array(query_embedding), k)
        return [self.text_chunks[i] for i in idx[0]]
