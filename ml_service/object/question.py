from typing import List
from object.response import Response

class Question:
    def __init__(self, content: str, answer_key: str, keyword: List[str], responses: List[Response]) -> None:
        self.content = content
        self.answer_key = answer_key
        self.keyword = keyword
        self.responses = [Response(**item) for item in responses]

    def to_dict(self):
        return {
            'content': self.content,
            'answer_key': self.answer_key,
            'keyword': self.keyword,
            'responses': [item.to_dict() for item in self.responses],
        }
