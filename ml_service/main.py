import json
import redis

from db import MongoDBHandler
from controller.zeroShotClassifier import ZeroShotClassifier
from controller.sentenceSimilarityClassifier import SentenceSimilarityClassifier
from controller.entropyWeight import EntropyWeight
from typing import List
import time
from datetime import datetime

from object.question import Question
from object.exam import Exam


mongo_handler = MongoDBHandler(
    "localhost", 14001, "root", "rahasia-root", "mydatabase")


def similarity_check(answer_key: str, response_list: List[str]):
    model = SentenceSimilarityClassifier()
    results = model.process([answer_key] + response_list)
    return results


def classification_check(keyword: List[str], response_list: List[str]):
    model = ZeroShotClassifier()
    results = model.process(response_list, keyword)
    return results


def score_weight(score_dict):
    weighter = EntropyWeight()
    result = weighter.calculate(score_dict)

    return result


def scoring_process(question: Question):
    response_list = [item.content for item in question.responses]

    similarity_result = similarity_check(question.answer_key, response_list)
    classification_result = classification_check(
        question.keyword, response_list)

    label_score_dict = {}
    label_score_dict["kunci_jawaban"] = similarity_result[0][1:]
    for i, sequence in enumerate(response_list):
        labels = classification_result[i]['labels']
        scores = classification_result[i]['scores']

        for label, score in zip(labels, scores):
            if label not in label_score_dict:
                label_score_dict[label] = []
            label_score_dict[label].append(score)

    scores, weights = score_weight(label_score_dict)

    question_scoring_data = {
        "content": question.content,
        "answer_key": question.answer_key,
        "keyword": question.keyword,
        "criteria_weights": weights,
        "responses": []
    }
    for index, value in enumerate(question.responses):
        question_scoring_data['responses'].append({
            "user_id": value.user_id,
            "content": value.content,
            "final_score": scores[index],
            "detail_score": {key: float(value[index]) for key, value in label_score_dict.items()}
        })

    json_data = json.dumps(question_scoring_data, indent=4)
    return json_data


def process_question(question, index):
    start_time = time.time()
    json_data = scoring_process(question)
    end_time = time.time()
    elapsed_time = end_time - start_time
    data = {
        "data": json.loads(json_data),
        "start_time": datetime.fromtimestamp(start_time),
        "end_time": datetime.fromtimestamp(end_time),
        "elapsed_time": elapsed_time
    }
    mongo_handler.insert_document("process_log", data)
    print(f"Time taken: {elapsed_time} seconds")
    print()
    return data

def process_exam(data):
    try:
        exam_data = Exam(**data)

        start_time = time.time()
        mongo_handler.insert_document("request_log", {
            "request_time": start_time,
            "data": exam_data.to_dict()
        })

        print(f"===== Start Processing Exam Batch - {exam_data.id} =====")

        start_time = time.time()
        question_list = exam_data.questions

        question_len = len(question_list)

        result_data = []

        for index, question in enumerate(question_list):
            print(f"--- Scoring per Question - {index}/{question_len} ---") 

            result = process_question(question, index)

            result_data.append(result)

        end_time = time.time()

        total_elapsed_time = end_time - start_time
        print(f"Batch time taken: {total_elapsed_time} seconds")
        print("===== Finish Processing Exam Batch =====")
        print()
        print("Listening...")

        mongo_handler.insert_document("batch_log", {
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
        error_time = time.time()
        mongo_handler.insert_document("error_log", {
            "error_time": datetime.fromtimestamp(error_time),
            "data": repr(e)
        })


def main():
    r = redis.Redis(host='localhost', port=14003, db=0)
    print("Listening...")

    while True:
        message = r.rpop('scoring_queue')

        if message:
            data = json.loads(message.decode())
            process_exam(data)

        time.sleep(1)

if __name__ == "__main__":
    main()
