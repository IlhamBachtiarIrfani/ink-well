from typing import List
from object.response import Response
from object.question import Question

class Exam:
    def __init__(self, id: str, title: str, questions: List[Question]) -> None:
        self.id = id
        self.title = title
        self.questions = [Question(**item) for item in questions]

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'question': [item.to_dict() for item in self.questions],
        }
