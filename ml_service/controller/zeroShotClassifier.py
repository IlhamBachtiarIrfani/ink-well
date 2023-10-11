from transformers import pipeline
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm
from typing import List
import numpy as np

def calc_result(value):
    center = 0.4
    top_value = 0.9

    if value < center:
        mapped_value = (value - center) / center
    else:
        mapped_value = (value - center) / (top_value - center)
    clipped_value = np.clip(mapped_value, 0, 1)
    return clipped_value

class ZeroShotClassifier:
    def __init__(self):
        pass

    def process_sequence(self, sequence, candidate_labels):
        classifier = pipeline("zero-shot-classification", model="./model/fine-tuned-zero-shot")
        result = classifier(sequence, candidate_labels, multi_label=True)
        result['scores'] = (calc_result(score) for score in result['scores'])
        return result

    def process(self, sequences: List[str], candidate_labels: List[str], num_threads=8):
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            results = list(tqdm(executor.map(self.process_sequence, sequences, [candidate_labels]*len(sequences)), total=len(sequences), desc="Classification"))

        return results
