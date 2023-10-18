from typing import List
from object.response import Response

class Question:
    def __init__(self, id: str, content: str, answer_key: str, keyword: List[str], responses: List[Response]) -> None:
        self.id = id
        self.content = content
        self.answer_key = answer_key
        self.keyword = keyword
        self.responses = [Response(**item) for item in responses]

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'answer_key': self.answer_key,
            'keyword': self.keyword,
            'response': [item.to_dict() for item in self.responses],
        }
