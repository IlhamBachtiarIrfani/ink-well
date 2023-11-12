from transformers import pipeline, AutoTokenizer
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm
from typing import List
from dotenv import load_dotenv
import os
from helper.threshold import calc_threshold
from controller.progressLogger import ProgressLogger
import concurrent.futures

load_dotenv()

ZERO_SHOT_CLASSIFICATION_THREAD = int(
    os.getenv('ZERO_SHOT_CLASSIFICATION_THREAD'))


class ZeroShotClassifier:
    def __init__(self, addProgress: ProgressLogger.addProgress):
        # INIT ZERO SHOT CLASSIFICATION MODEL
        model_name = "./model/fine-tuned-model"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.classifier = pipeline(
            "zero-shot-classification",
            model=model_name,
            tokenizer=tokenizer
        )
        self.addProgress = addProgress

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

    def update_progress_bar(self, value, done, total):
        self.addProgress('Keyword Classification', value * 100,
                         f'Finish processing the classification of the response, part {done} out of {total}.')

    def process(self,
                sequences: List[str],
                candidate_labels: List[str], num_threads=ZERO_SHOT_CLASSIFICATION_THREAD):
        self.addProgress('Keyword Classification', 0,
                         f'Beginning the process of checking the response using keyword classification.')
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
            pbar = tqdm(total=len(sequences), desc="Classification")
            results = []
            for result in executor.map(
                self.process_sequence,
                sequences,
                [candidate_labels]*len(sequences)
            ):
                results.append(result)
                pbar.update()
                progress = pbar.n / pbar.total  # calculate progress as a fraction
                # update the database with the current progress
                self.update_progress_bar(progress, len(results), len(sequences))
            pbar.close()

        
        self.addProgress('Keyword Classification', 100,
                         f'Finishing the process of checking the response using keyword classification.')
        return results  # return the results
