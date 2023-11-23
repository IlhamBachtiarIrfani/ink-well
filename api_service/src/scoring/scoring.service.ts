import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageBrokerService } from 'src/message_broker/message_broker.service';
import { classToPlain } from 'class-transformer';
import { Exam } from 'src/exam/entities/exam.entity';
import { ExamScore, ExamScoreStatus } from './entities/exam_score.entity';
import { UserTokenData } from 'src/user/entities/user.entity';
import { Question } from 'src/question/entities/question.entity';
import { ExamAccess } from 'src/exam/entities/exam-access.entity';

@Injectable()
export class ScoringService {
    constructor(
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,
        @InjectRepository(ExamAccess)
        private examAccessRepository: Repository<ExamAccess>,
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
        @InjectRepository(ExamScore)
        private examScoreRepository: Repository<ExamScore>,
        private messageBrokerService: MessageBrokerService,
    ) {}

    async processScoring(examId: string) {
        const data = await this.examRepository
            .createQueryBuilder('exam')
            .select(['exam.id', 'exam.title'])
            .leftJoin('exam.question', 'question')
            .addSelect([
                'question.id',
                'question.content',
                'question.answer_key',
            ])
            .leftJoin('question.keyword', 'keyword')
            .addSelect(['keyword.keyword'])
            .leftJoin('question.response', 'response')
            .addSelect(['response.user_id', 'response.content'])
            .where('exam.id = :id', { id: examId })
            .getOne();

        const processedData = classToPlain(data);

        const newExamScoreData = new ExamScore();
        newExamScoreData.exam_id = examId;

        await this.examScoreRepository.save(newExamScoreData);

        console.log('REQUEST PROCESS SCORING');

        await this.messageBrokerService.publishMessage(processedData);

        return processedData;
    }

    async examScore(userTokenData: UserTokenData, id: string) {
        const examData = await this.examRepository
            .createQueryBuilder('exam')
            .leftJoinAndSelect('exam.score', 'exam_score')
            .leftJoinAndSelect('exam.question', 'question')
            .leftJoinAndSelect('question.score', 'question_score')
            .leftJoinAndSelect('exam.exam_access', 'exam_access')
            .leftJoinAndSelect('exam_access.user', 'user')
            .leftJoinAndSelect('exam_access.score', 'user_score')
            .where('exam.id =  :id', { id: id })
            .orderBy('question.created_at', 'ASC')
            .addOrderBy('user_score.score_percentage', 'DESC')
            .getOne();

        if (!examData) {
            throw new NotFoundException('EXAM_NOT_FOUND');
        }

        if (!examData.score || examData.score.status != ExamScoreStatus.DONE) {
            throw new BadRequestException('EXAM_NOT_SCORED_YET');
        }

        return examData;
    }

    async questionScore(
        userTokenData: UserTokenData,
        examId: string,
        questionId: string,
    ) {
        const examData = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.score', 'question_score')
            .leftJoinAndSelect('question.response', 'response')
            .leftJoinAndSelect('response.user', 'user')
            .leftJoinAndSelect('response.response_score', 'response_score')
            .where('question.id = :id AND question.exam_id = :exam_id', {
                id: questionId,
                exam_id: examId,
            })
            .orderBy('response_score.final_score', 'DESC')
            .getOne();

        if (!examData) {
            throw new NotFoundException('EXAM_NOT_FOUND');
        }

        if (!examData.score) {
            throw new BadRequestException('EXAM_NOT_SCORED_YET');
        }

        return examData;
    }

    async userScore(
        userTokenData: UserTokenData,
        examId: string,
        userId: string,
    ) {
        const examData = await this.examAccessRepository
            .createQueryBuilder('exam_access')
            .leftJoinAndSelect('exam_access.user', 'user')
            .leftJoin('exam_access.score', 'exam_score')
            .leftJoin('exam_access.exam', 'exam')
            .leftJoin('exam.question', 'question')
            .leftJoinAndMapOne(
                'question.response',
                'question.response',
                'response',
                'response.user_id = :user_id',
                { user_id: userId },
            )
            .leftJoin('response.response_score', 'question_score')
            .select(['exam_access.type'])
            .addSelect(['user.name', 'user.email', 'user.photo_url'])
            .addSelect(['question.content', 'question.point'])
            .addSelect(['exam.title', 'exam.desc', 'exam.pass_score'])
            .addSelect([
                'exam_score.final_score',
                'exam_score.score_percentage',
                'exam_score.is_pass',
            ])
            .addSelect(['response.content'])
            .addSelect([
                'question_score.final_score',
                'question_score.detail_score',
            ])
            .where(
                'exam_access.exam_id = :exam_id AND exam_access.user_id = :user_id',
                {
                    exam_id: examId,
                    user_id: userId,
                },
            )
            .getOne();

        if (!examData) {
            throw new NotFoundException('EXAM_NOT_FOUND');
        }

        return examData;
    }
}
