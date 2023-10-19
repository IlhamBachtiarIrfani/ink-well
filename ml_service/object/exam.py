from typing import List
from object.response import Response
from object.question import Question

class Exam:
    def __init__(self, id: str, title: str, question: List[Question]) -> None:
        self.id = id
        self.title = title
        self.question = [Question(**item) for item in question]

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'question': [item.to_dict() for item in self.question],
        }
