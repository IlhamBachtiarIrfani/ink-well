from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List
import concurrent.futures
from tqdm import tqdm
from dotenv import load_dotenv
import os
from helper.threshold import calc_threshold
from controller.progressLogger import ProgressLogger
from bs4 import BeautifulSoup

load_dotenv()

SENTENCE_SIMILARITY_THREAD = int(os.getenv('SENTENCE_SIMILARITY_THREAD'))
BOTTOM_THRESHOLD = .3
TOP_THRESHOLD = .9

model = SentenceTransformer(
    './model/sentence-similarity-fine-tuned-model')


class SentenceSimilarityClassifier:
    def __init__(self, addProgress: ProgressLogger.addProgress):
        # INIT SENTENCE SIMILARITY MODEL
        self.addProgress = addProgress

    def remove_html_tags(self, text):
        soup = BeautifulSoup(text, "html.parser")
        return soup.get_text()

    def encode_sentence(self, sentence):
        # DECODE SENTENCE
        return model.encode([sentence])[0]

    def update_progress_bar(self, value, done, total):
        self.addProgress('Answer Key Similarity', value * 100,
                         f'Finish processing part number {done} out of a total of {total} parts for the response embedding.')

    def encode_with_progress_bar(self, sentences, num_threads=SENTENCE_SIMILARITY_THREAD):
        with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
            pbar = tqdm(total=len(sentences), desc="Similarity")
            results = []
            for result in executor.map(self.encode_sentence, sentences):
                results.append(result)
                pbar.update()
                progress = pbar.n / pbar.total  # calculate progress as a fraction
                self.update_progress_bar(progress, len(results), len(sentences))  # update the database with the current progress
            pbar.close()
        return results  # return the results

    def process(self, sentences: List[str]):
        self.addProgress('Answer Key Similarity', 0,
                         f'Beginning the process of checking the similarity between the response and the answer key.')
        
        sentences = [self.remove_html_tags(item) for item in sentences]

        # START SENTENCE EMBEDDING
        embeddings = self.encode_with_progress_bar(sentences)

        self.addProgress('Answer Key Similarity', 100,
                         f'Begin the process of calculating the cosine similarity.')
        # CHECK SENTENCE SIMILARITY USING COSINE
        similarity_matrix = cosine_similarity(embeddings)

        # SET THE RESULT USING DEFAULT THRESHOLD VALUE
        for i in range(len(similarity_matrix)):
            for j in range(len(similarity_matrix[i])):
                value = similarity_matrix[i][j]
                value = calc_threshold(value, bottom_value=BOTTOM_THRESHOLD, top_value=TOP_THRESHOLD)
                similarity_matrix[i][j] = value

        self.addProgress('Answer Key Similarity', 100,
                         f'Finishing the process of checking the similarity between the response and the answer key.')

        return similarity_matrix
