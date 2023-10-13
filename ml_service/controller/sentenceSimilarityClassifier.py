from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List
import concurrent.futures
from tqdm import tqdm
from dotenv import load_dotenv
import os
from helper.threshold import calc_threshold

load_dotenv()

SENTENCE_SIMILARITY_THREAD = int(os.getenv('SENTENCE_SIMILARITY_THREAD'))


class SentenceSimilarityClassifier:
    def __init__(self):
        # INIT SENTENCE SIMILARITY MODEL
        self.model = SentenceTransformer(
            './model/sentence-similarity-fine-tuned-model')

    def encode_sentence(self, sentence):
        # DECODE SENTENCE
        return self.model.encode([sentence])[0]

    def encode_with_progress_bar(
        self,
            sentences: List[str],
            num_threads=SENTENCE_SIMILARITY_THREAD
    ):
        # DO MULTI THREAD AND ADD PROGRESS BAR
        with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
            embeddings = list(
                tqdm(
                    executor.map(
                        self.encode_sentence,
                        sentences
                    ),
                    total=len(sentences),
                    desc="Similarity"
                )
            )

        return embeddings

    def process(self, sentences: List[str]):
        # START SENTENCE EMBEDDING
        embeddings = self.encode_with_progress_bar(sentences)

        # CHECK SENTENCE SIMILARITY USING COSINE
        similarity_matrix = cosine_similarity(embeddings)

        # SET THE RESULT USING DEFAULT THRESHOLD VALUE
        for i in range(len(similarity_matrix)):
            for j in range(len(similarity_matrix[i])):
                value = similarity_matrix[i][j]
                value = calc_threshold(value, bottom_value=0.4, top_value=0.75)
                similarity_matrix[i][j] = value

        return similarity_matrix
