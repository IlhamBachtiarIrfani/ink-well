from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List
import numpy as np
import concurrent.futures
from tqdm import tqdm

def calc_result(value):
    center = 0.4
    top_value = 0.95  # Change the top value to 0.9

    if value < center:
        mapped_value = (value - center) / center
    else:
        mapped_value = (value - center) / (top_value - center)  # Use the top_value here
    clipped_value = np.clip(mapped_value, 0, 1)
    return clipped_value

class SentenceSimilarityClassifier:
    def __init__(self):
        self.model = SentenceTransformer('./model/fine-tuned-model')

    def encode_sentence(self, sentence):
        return self.model.encode([sentence])[0]

    def encode_with_progress_bar(self, sentences: List[str], num_threads=8):
        with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
            embeddings = list(tqdm(executor.map(self.encode_sentence, sentences), total=len(sentences), desc="Similarity"))

        return embeddings

    def process(self, sentences: List[str]):
        embeddings = self.encode_with_progress_bar(sentences)
        similarity_matrix = cosine_similarity(embeddings)

        for i in range(len(similarity_matrix)):
            for j in range(len(similarity_matrix[i])):
                value = similarity_matrix[i][j]
                value = calc_result(value)
                similarity_matrix[i][j] = value

        return similarity_matrix
