import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


class VectorStore:
    def __init__(self, model_name: str):
        # Force CPU & low memory usage
        self.model = SentenceTransformer(
            model_name,
            device="cpu"
        )
        self.index = None
        self.text_chunks = []

    def build(self, chunks):
        self.text_chunks = chunks

        # Convert directly to numpy (saves memory)
        embeddings = self.model.encode(
            chunks,
            convert_to_numpy=True,
            show_progress_bar=False
        )

        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(embeddings)

    def search(self, query, k=5):
        query_embedding = self.model.encode(
            [query],
            convert_to_numpy=True
        )

        _, idx = self.index.search(query_embedding, k)
        return [self.text_chunks[i] for i in idx[0]]
