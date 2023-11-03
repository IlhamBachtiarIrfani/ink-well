from dotenv import load_dotenv
import os
import pika
import json
from object.exam import Exam
from controller.scoringController import process_exam
import jsonschema
from jsonschema import validate


print(" [*] Preparing... ")

load_dotenv()

# ! ===== GET ENV DATA =====
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST')
RABBITMQ_PORT = os.getenv('RABBITMQ_PORT')
RABBITMQ_USER = os.getenv('RABBITMQ_USER')
RABBITMQ_PASSWORD = os.getenv('RABBITMQ_PASSWORD')
RABBITMQ_QUEUE = os.getenv('RABBITMQ_QUEUE')

# ! ===== CONNECT TO RABBIT MQ =====
credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
parameters = pika.ConnectionParameters(
    RABBITMQ_HOST, RABBITMQ_PORT, '/', credentials)
connection = pika.BlockingConnection(parameters)

# ! ===== DEFAULT RABBIT MQ CHANNEL =====
channel = connection.channel()
channel.queue_declare(queue=RABBITMQ_QUEUE)

schema = {
    "type": "object",
    "properties": {
        "pattern": {
            "type": "string"
        },
        "data": {
            "type": "object",
            "properties": {
                "id": {"type": "string"},
                "title": {"type": "string"},
                "question": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "string"},
                            "content": {"type": "string"},
                            "answer_key": {"type": "string"},
                            "keyword": {
                                "type": "array",
                                "items": {"type": "string"}
                            },
                            "response": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "user_id": {"type": "string"},
                                        "content": {"type": "string"}
                                    },
                                    "required": ["user_id", "content"]
                                }
                            }
                        },
                        "required": ["id","content", "answer_key", "keyword", "response"]
                    }
                }
            },
            "required": ["id", "title", "question"]
        },
    },
    "required": ["pattern", "data"]
}


def check_data_format(json_data):
    try:
        validate(instance=json_data, schema=schema)
        print(" [*] VALID JSON FORMAT")
        return True
    except jsonschema.exceptions.ValidationError as e:
        print(" [e] INVALID JSON FORMAT")
        return False

# ! ===== QUEUE CALLBACK FUNCTION =====


def callback(ch, method, properties, body):
    print(" [x] Scoring data received ")
    # PROCESS THE AUTO SCORING
    json_obj = json.loads(body)

    is_valid = check_data_format(json_obj)

    if (is_valid):
        data = json_obj['data']
        process_exam(data)


# ! ===== MAIN FUNCTION =====
def main():
    channel.basic_consume(
        queue=RABBITMQ_QUEUE,
        auto_ack=True,
        on_message_callback=callback
    )

    print(' [*] Waiting for scoring data. To exit press CTRL+C')
    channel.start_consuming()


if __name__ == "__main__":
    main()
