from sqlalchemy import Column, String, Double, Boolean, create_engine
from sqlalchemy.sql import text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()


username = os.getenv('DB_USER')
password = os.getenv('DB_PASSWORD')
host = os.getenv('DB_HOST')
port = int(os.getenv('DB_PORT'))
database_name = os.getenv('DB_NAME')


Base = declarative_base()


class ExamScore(Base):
    __tablename__ = 'exam_score'

    exam_id = Column(String, primary_key=True)
    status = Column(String)
    distribution_data = Column(String)
    pass_rate = Column(Double)
    minScore = Column(Double)
    maxScore = Column(Double)
    avgScore = Column(Double)
    q1Score = Column(Double)
    q2Score = Column(Double)
    q3Score = Column(Double)


class UserExamScore(Base):
    __tablename__ = 'user_exam_score'

    user_id = Column(String, primary_key=True)
    exam_id = Column(String, primary_key=True)
    final_score = Column(Double)
    detail_score = Column(String)
    score_percentage = Column(Double)
    is_pass = Column(Boolean)


class QuestionScore(Base):
    __tablename__ = 'question_score'

    question_id = Column(String, primary_key=True)
    status = Column(String)
    criteria_weights = Column(String)
    distribution_data = Column(String)
    minScore = Column(Double)
    maxScore = Column(Double)
    avgScore = Column(Double)
    q1Score = Column(Double)
    q2Score = Column(Double)
    q3Score = Column(Double)


class ResponseScore(Base):
    __tablename__ = 'response_score'

    user_id = Column(String, primary_key=True)
    question_id = Column(String, primary_key=True)
    final_score = Column(Double)
    detail_score = Column(String)


class DataManager:
    def __init__(self):
        self.engine = create_engine(
            f'mariadb+mariadbconnector://{username}:{password}@{host}:{port}/{database_name}')
        self.Session = sessionmaker(bind=self.engine)

    def update_exam_score_status(self, exam_id, status):
        session = self.Session()
        exam_score = session.query(ExamScore).filter_by(
            exam_id=exam_id).first()
        exam_score.status = status
        session.commit()

    def update_question_score_status(self, question_id, status):
        session = self.Session()
        score = QuestionScore(question_id=question_id, status=status)
        session.merge(score)
        session.commit()

    def update_question_score_data(self, question_id, status, criteria_weights, distribution_data, minScore, maxScore, avgScore, q1Score, q2Score, q3Score):
        session = self.Session()
        score = QuestionScore(
            question_id=question_id,
            status=status,
            criteria_weights=criteria_weights,
            distribution_data=distribution_data,
            minScore=minScore,
            maxScore=maxScore,
            avgScore=avgScore,
            q1Score=q1Score,
            q2Score=q2Score,
            q3Score=q3Score
        )
        session.merge(score)
        session.commit()

    def update_exam_score_data(self, exam_id, status, pass_rate, distribution_data, minScore, maxScore, avgScore, q1Score, q2Score, q3Score):
        session = self.Session()
        score = ExamScore(
            exam_id=exam_id,
            status=status,
            pass_rate=pass_rate,
            distribution_data=distribution_data,
            minScore=minScore,
            maxScore=maxScore,
            avgScore=avgScore,
            q1Score=q1Score,
            q2Score=q2Score,
            q3Score=q3Score
        )
        session.merge(score)
        session.commit()

    def update_response_score(self, user_id, question_id, final_score, detail_score):
        session = self.Session()
        score = ResponseScore(
            user_id=user_id,
            question_id=question_id,
            final_score=final_score,
            detail_score=detail_score
        )
        session.merge(score)
        session.commit()

    def select_user_exam_by_exam_id(self, exam_id):
        session = self.Session()
        query = session.query(UserExamScore).filter(
            UserExamScore.exam_id == exam_id)
        results = query.all()

        return results

    def update_user_exam_data(self, exam_id):
        query = text("""
            INSERT INTO user_exam_score(user_id,exam_id,final_score,detail_score,score_percentage,is_pass)
            SELECT 
                r.user_id,
                e.id,
                SUM((q.`point`*rs.final_score)) AS final_score, 
                JSON_OBJECTAGG(
                    q.id, 
                    JSON_OBJECT(
                        'score',(q.`point` * rs.final_score),
                        'percentage',(rs.final_score),
                        'detail', rs.detail_score
                    )
                ) AS detail_score,
                SUM(q.`point`*rs.final_score) / SUM(q.`point`) AS score_percentage,
                IF(e.pass_score <= SUM(q.`point`*rs.final_score) / SUM(q.`point`), true, false) AS is_pass
            FROM exam e
            LEFT JOIN question q
                ON e.id = q.exam_id 
            LEFT JOIN response r 
                ON q.id = r.question_id
            LEFT JOIN response_score rs
                ON r.user_id = rs.user_id AND r.question_id = rs.question_id
            WHERE e.id = :exam_id
            GROUP BY e.id, r.user_id
            ON DUPLICATE KEY UPDATE 
                final_score = VALUES(final_score),
                detail_score = VALUES(detail_score),
                score_percentage = VALUES(score_percentage),
                is_pass = VALUES(is_pass);
        """)

        params = {
            "exam_id": exam_id
        }

        session = self.Session()
        session.execute(query, params)
        session.commit()
