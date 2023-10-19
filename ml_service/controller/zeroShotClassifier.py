from transformers import pipeline, AutoTokenizer
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm
from typing import List
from dotenv import load_dotenv
import os
from helper.threshold import calc_threshold

load_dotenv()

ZERO_SHOT_CLASSIFICATION_THREAD = int(os.getenv('ZERO_SHOT_CLASSIFICATION_THREAD'))


class ZeroShotClassifier:
    def __init__(self):
        # INIT ZERO SHOT CLASSIFICATION MODEL
        model_name = "./model/fine-tuned-model"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.classifier = pipeline(
            "zero-shot-classification",
            model=model_name,
            tokenizer=tokenizer
        )

    def process_sequence(self, sequence, candidate_labels):
        # PROCESS CLASSIFIER
        result = self.classifier(sequence, candidate_labels, multi_label=True)

        # SET THE SCORES TO CURRENT THRESHOLD
        result['scores'] = [
            calc_threshold(
                score, bottom_value=0.4, top_value=0.9
            ) for score in result['scores']
        ]
        return result

    def process(
            self,
            sequences: List[str],
            candidate_labels: List[str], num_threads=ZERO_SHOT_CLASSIFICATION_THREAD
    ):
        # DO MULTI THREAD AND ADD PROGRESS BAR
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            results = list(
                tqdm(
                    executor.map(
                        self.process_sequence,
                        sequences,
                        [candidate_labels]*len(sequences)
                    ),
                    total=len(sequences),
                    desc="Classification")
            )

        return results
