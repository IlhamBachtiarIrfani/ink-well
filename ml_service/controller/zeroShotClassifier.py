from transformers import pipeline
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm
from typing import List

class ZeroShotClassifier:
    def __init__(self):
        self.classifier = pipeline("zero-shot-classification", model="./model/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7")

    def process_sequence(self, sequence, candidate_labels):
        return self.classifier(sequence, candidate_labels, multi_label=True)

    def process(self, sequences: List[str], candidate_labels: List[str], num_threads=8):
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            results = list(tqdm(executor.map(self.process_sequence, sequences, [candidate_labels]*len(sequences)), total=len(sequences), desc="Classification"))

        return results