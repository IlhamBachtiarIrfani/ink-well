import json
import redis
from dotenv import load_dotenv
import os

load_dotenv()

redisHost = os.getenv('REDIS_HOST')
redisPort = int(os.getenv('REDIS_PORT'))

r = redis.Redis(
    host=redisHost,
    port=redisPort,
)

class ProgressLogger:
    def __init__(self, exam_id):
        self.exam_id = exam_id
    
    def addProgress(self, progress_type, progress_percent, progress_detail):
        data = {
            "id": self.exam_id,
            "data": {
                "progress_type": progress_type,
                "progress_percent": progress_percent,
                "progress_detail": progress_detail,
            }
        }

        r.publish("ml-progress", json.dumps(data))
        pass