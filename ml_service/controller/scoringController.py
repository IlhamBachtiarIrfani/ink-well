import json

from helper.db import MongoDBHandler
from controller.zeroShotClassifier import ZeroShotClassifier
from controller.sentenceSimilarityClassifier import SentenceSimilarityClassifier
from controller.entropyWeight import EntropyWeight
from controller.progressLogger import ProgressLogger
from controller.dataManager import DataManager
from typing import List
import time
from datetime import datetime

from object.question import Question
from object.exam import Exam
from dotenv import load_dotenv
import os
import traceback
import sys
import numpy as np
import pandas as pd

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


def _similarity_check(answer_key: str, response_list: List[str], addProgress: ProgressLogger.addProgress):
    model = SentenceSimilarityClassifier(addProgress)
    results = model.process([answer_key] + response_list)
    return results


def _classification_check(keyword: List[str], response_list: List[str],  addProgress: ProgressLogger.addProgress):
    model = ZeroShotClassifier(addProgress)
    results = model.process(response_list, keyword)
    return results


def _score_weight(score_dict):
    weighter = EntropyWeight()
    result = weighter.calculate(score_dict)

    return result


def _scoring_process(question: Question, addProgress: ProgressLogger.addProgress):
    response_list = [item.content for item in question.response]

    similarity_result = _similarity_check(
        question.answer_key, response_list, addProgress)

    classification_result = _classification_check(
        question.keyword, response_list, addProgress)

    addProgress('Score Weighting', 0,
                f'Beginning the calculation of the dynamic weight for the responses')

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

    min_score = scores.min()
    max_score = scores.max()
    avg_score = scores.mean()

    q1_score = np.percentile(scores, 25)
    q2_score = np.percentile(scores, 50)
    q3_score = np.percentile(scores, 75)

    bins = np.arange(0, 110, 10)
    data_bin = pd.cut(scores*100, bins,include_lowest=True)
    bin_counts = pd.value_counts(data_bin, sort=False)
    formatted_labels = [f"{int(start)} - {int(end)}" if pd.notna(start) else f"{int(end)} and below" for start, end in zip(bins[:-1], bins[1:])]

    # Assign the formatted labels to the bin_counts
    bin_counts.index = formatted_labels

    # Convert bin_counts to a dictionary
    bin_counts_dict = bin_counts.to_dict()

    question_scoring_data = {
        "id": question.id,
        "content": question.content,
        "answer_key": question.answer_key,
        "keyword": question.keyword,
        "criteria_weights": weights,
        "min_score": min_score,
        "max_score": max_score,
        "avg_score": avg_score,
        "q1_score": q1_score,
        "q2_score": q2_score,
        "q3_score": q3_score,
        "distribution_data": bin_counts_dict,
        "response": []
    }

    dataManager = DataManager()
    dataManager.update_question_score_data(question.id, "DONE", json.dumps(
        weights), json.dumps(bin_counts_dict), min_score, max_score, avg_score, q1_score, q2_score, q3_score)

    for index, value in enumerate(question.response):
        final_score = scores[index]
        detail_score = {key: float(value[index])
                        for key, value in label_score_dict.items()}

        question_scoring_data['response'].append({
            "user_id": value.user_id,
            "content": value.content,
            "final_score": final_score,
            "detail_score": detail_score
        })

        dataManager.update_response_score(
            value.user_id, question.id, final_score, json.dumps(detail_score))

    addProgress('Score Weighting', 100,
                f'Finishing the calculation of the dynamic weight for the responses')

    json_data = json.dumps(question_scoring_data, indent=4)
    return json_data


def _process_question(question, addProgress: ProgressLogger.addProgress):
    start_time = time.time()

    json_data = _scoring_process(question, addProgress)

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
        progressLogger = ProgressLogger(exam_data.id)

        dataManager = DataManager()
        dataManager.update_exam_score_status(exam_data.id, "ON_PROGRESS")

        progressLogger.addProgress(
            'All', 0, 'Preparing response data.')

        start_time = time.time()
        mongo_handler.insert_document("ml-request-log", {
            "request_time": start_time,
            "data": exam_data.to_dict()
        })

        print(f"===== Start Processing Exam Batch - {exam_data.id} =====")

        start_time = time.time()
        question_list = exam_data.question

        question_len = len(question_list)

        for question in question_list:
            dataManager.update_question_score_status(question.id, "ON_QUEUE")

        result_data = []

        for index, question in enumerate(question_list):
            progressLogger.addProgress(
                'All', index / question_len * 100, f'Scoring question responses, on question {index+1} of {question_len}.')

            dataManager.update_question_score_status(
                question.id, "ON_PROGRESS")

            print(f"--- Scoring per Question - {index}/{question_len} ---")

            if (len(question.response) == 0):
                dataManager.update_question_score_status(question.id, "DONE")
                progressLogger.addProgress(
                    'All', (index+1) / question_len * 100, f'Scoring for question {index+1} is done.')
                continue

            result = _process_question(question, progressLogger.addProgress)
            result_data.append(result)

            progressLogger.addProgress(
                'All', (index+1) / question_len * 100, f'Scoring for question {index+1} is done.')

        dataManager.update_user_exam_data(exam_data.id)

        userExamList = dataManager.select_user_exam_by_exam_id(exam_data.id)

        finalScoreList = [item.score_percentage for item in userExamList]
        passStatusList = [item.is_pass for item in userExamList]

        finalScoreNpList = np.array(finalScoreList)

        min_score = finalScoreNpList.min()
        max_score = finalScoreNpList.max()
        avg_score = finalScoreNpList.mean()

        q1_score = np.percentile(finalScoreNpList, 25)
        q2_score = np.percentile(finalScoreNpList, 50)
        q3_score = np.percentile(finalScoreNpList, 75)

        bins = np.arange(0, 110, 10)
        data_bin = pd.cut(finalScoreNpList * 100, bins, include_lowest=True)
        bin_counts = pd.value_counts(data_bin, sort=False)
        formatted_labels = [f"{int(start)} - {int(end)}" if pd.notna(start) else f"{int(end)} and below" for start, end in zip(bins[:-1], bins[1:])]

        # Assign the formatted labels to the bin_counts
        bin_counts.index = formatted_labels

        # Convert bin_counts to a dictionary
        bin_counts_dict = bin_counts.to_dict()

        totalPassData = len(passStatusList)
        totalTruePassData = sum(passStatusList)
        passPercentage = (totalTruePassData / totalPassData)

        dataManager.update_exam_score_data(exam_data.id, "DONE", passPercentage, json.dumps(
            bin_counts_dict), min_score, max_score, avg_score, q1_score, q2_score, q3_score)

        end_time = time.time()

        total_elapsed_time = end_time - start_time
        print(f"Batch time taken: {total_elapsed_time} seconds")
        print("===== Finish Processing Exam Batch =====")

        progressLogger.addProgress(
            'Completed', 100, 'Quiz scoring is completed')

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

        dataManager.update_exam_score_status(exam_data.id, "ERROR")

        error_time = time.time()
        mongo_handler.insert_document("ml-error-log", {
            "error_time": datetime.fromtimestamp(error_time),
            "data": repr(e)
        })
