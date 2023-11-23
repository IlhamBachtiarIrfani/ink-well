from transformers import pipeline, AutoTokenizer
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm
from typing import List
from dotenv import load_dotenv
import os
from helper.threshold import calc_threshold
from controller.progressLogger import ProgressLogger
import concurrent.futures
from bs4 import BeautifulSoup

load_dotenv()

ZERO_SHOT_CLASSIFICATION_THREAD = int(
    os.getenv('ZERO_SHOT_CLASSIFICATION_THREAD'))
BOTTOM_THRESHOLD = .3
TOP_THRESHOLD = .9

model_name = "./model/old-zero-shot-classification-model-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
classifier = pipeline(
    "zero-shot-classification",
    model=model_name,
    tokenizer=tokenizer
)


class ZeroShotClassifier:
    def __init__(self, addProgress: ProgressLogger.addProgress):
        # INIT ZERO SHOT CLASSIFICATION MODEL
        
        self.addProgress = addProgress

    def remove_html_tags(self, text):
        soup = BeautifulSoup(text, "html.parser")
        return soup.get_text()

    def process_sequence(self, sequence, candidate_labels):
        if len(sequence) < 30:
            # If so, return a score of 0 without processing
            return {'scores': [0] * len(candidate_labels), 'labels': candidate_labels}

        # PROCESS CLASSIFIER
        result = classifier(sequence, candidate_labels, multi_label=True)

        # SET THE SCORES TO CURRENT THRESHOLD
        result['scores'] = [
            calc_threshold(
                score, bottom_value=BOTTOM_THRESHOLD, top_value=TOP_THRESHOLD
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

        sequences = [self.remove_html_tags(item) for item in sequences]

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
                self.update_progress_bar(
                    progress, len(results), len(sequences))
            pbar.close()

        self.addProgress('Keyword Classification', 100,
                         f'Finishing the process of checking the response using keyword classification.')
        return results  # return the results
