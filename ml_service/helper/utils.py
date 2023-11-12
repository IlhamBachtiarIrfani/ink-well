SCORING_SCHEMA = {
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
                        "required": ["id", "content", "answer_key", "keyword", "response"]
                    }
                }
            },
            "required": ["id", "title", "question"]
        },
    },
    "required": ["pattern", "data"]
}
