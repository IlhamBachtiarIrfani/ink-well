from dotenv import load_dotenv
import os
import pika
import json

load_dotenv()

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST')
RABBITMQ_PORT = os.getenv('RABBITMQ_PORT')
RABBITMQ_USER = os.getenv('RABBITMQ_USER')
RABBITMQ_PASSWORD = os.getenv('RABBITMQ_PASSWORD')
RABBITMQ_QUEUE = os.getenv('RABBITMQ_QUEUE')


credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)

parameters = pika.ConnectionParameters(
    RABBITMQ_HOST, RABBITMQ_PORT, '/', credentials)

connection = pika.BlockingConnection(parameters)
channel = connection.channel()

channel.queue_declare(queue=RABBITMQ_QUEUE)

with open('example-data.json', 'r') as f:
    data = json.load(f)

channel.basic_publish(exchange='',
                      routing_key=RABBITMQ_QUEUE,
                      body=json.dumps(data))
print(" [x] Sent 'JSON DATA!'")

connection.close()
