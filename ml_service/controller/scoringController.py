import json

from helper.db import MongoDBHandler
from controller.zeroShotClassifier import ZeroShotClassifier
from controller.sentenceSimilarityClassifier import SentenceSimilarityClassifier
from controller.entropyWeight import EntropyWeight
from typing import List
import time
from datetime import datetime

from object.question import Question
from object.exam import Exam
from dotenv import load_dotenv
import os
import traceback
import sys

load_dotenv()

MONGO_HOST = os.getenv('MONGO_HOST')
MONGO_PORT = os.getenv('MONGO_PORT')
MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')

mongo_handler = MongoDBHandler(
    host=MONGO_HOST,
    port=MONGO_PORT,
    username=MONGO_USER,
    password=MONGO_PASSWORD,
    database_name=MONGO_DB_NAME
)


def _similarity_check(answer_key: str, response_list: List[str]):
    model = SentenceSimilarityClassifier()
    results = model.process([answer_key] + response_list)
    return results


def _classification_check(keyword: List[str], response_list: List[str]):
    model = ZeroShotClassifier()
    results = model.process(response_list, keyword)
    return results


def _score_weight(score_dict):
    weighter = EntropyWeight()
    result = weighter.calculate(score_dict)

    return result


def _scoring_process(question: Question):
    response_list = [item.content for item in question.response]

    similarity_result = _similarity_check(question.answer_key, response_list)
    classification_result = _classification_check(
        question.keyword, response_list)

    label_score_dict = {}
    label_score_dict["Answer Key"] = similarity_result[0][1:]
    for i, sequence in enumerate(response_list):
        labels = classification_result[i]['labels']
        scores = classification_result[i]['scores']

        for label, score in zip(labels, scores):
            if label not in label_score_dict:
                label_score_dict[label] = []
            label_score_dict[label].append(score)

    scores, weights = _score_weight(label_score_dict)

    question_scoring_data = {
        "content": question.content,
        "answer_key": question.answer_key,
        "keyword": question.keyword,
        "criteria_weights": weights,
        "response": []
    }
    for index, value in enumerate(question.response):
        question_scoring_data['response'].append({
            "user_id": value.user_id,
            "content": value.content,
            "final_score": scores[index],
            "detail_score": {key: float(value[index]) for key, value in label_score_dict.items()}
        })

    json_data = json.dumps(question_scoring_data, indent=4)
    return json_data


def _process_question(question):
    start_time = time.time()
    json_data = _scoring_process(question)
    end_time = time.time()
    elapsed_time = end_time - start_time
    data = {
        "data": json.loads(json_data),
        "start_time": datetime.fromtimestamp(start_time),
        "end_time": datetime.fromtimestamp(end_time),
        "elapsed_time": elapsed_time
    }
    mongo_handler.insert_document("ml-process-log", data)
    print(f"Time taken: {elapsed_time} seconds")
    print()
    return data


def process_exam(data):
    try:
        exam_data = Exam(**data)

        start_time = time.time()
        mongo_handler.insert_document("ml-request-log", {
            "request_time": start_time,
            "data": exam_data.to_dict()
        })

        print(f"===== Start Processing Exam Batch - {exam_data.id} =====")

        start_time = time.time()
        question_list = exam_data.question

        question_len = len(question_list)

        result_data = []

        for index, question in enumerate(question_list):
            print(f"--- Scoring per Question - {index}/{question_len} ---")

            result = _process_question(question)

            result_data.append(result)

        end_time = time.time()

        total_elapsed_time = end_time - start_time
        print(f"Batch time taken: {total_elapsed_time} seconds")
        print("===== Finish Processing Exam Batch =====")

        mongo_handler.insert_document("ml-batch-log", {
            "start_time": datetime.fromtimestamp(start_time),
            "end_time": datetime.fromtimestamp(end_time),
            "total_elapsed_time": total_elapsed_time,
            "data": {
                "id": exam_data.id,
                "title": exam_data.title,
                "question": result_data
            }
        })
    except Exception as e:
        print(f"Error processing message: {e}")

        exc_type, exc_value, exc_traceback = sys.exc_info()
        traceback_details = traceback.extract_tb(exc_traceback)
        filename = traceback_details[-1].filename
        line_num = traceback_details[-1].lineno
        print(f"Exception occurred in file {filename} at line {line_num}")

        error_time = time.time()
        mongo_handler.insert_document("ml-error-log", {
            "error_time": datetime.fromtimestamp(error_time),
            "data": repr(e)
        })
