from typing import List

class Response:
    def __init__(self, user_id: str, content: str) -> None:
        self.content = content
        self.user_id = user_id

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'content': self.content,
        }
