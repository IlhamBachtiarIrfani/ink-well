import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageBrokerService } from 'src/message_broker/message_broker.service';
import { classToPlain } from 'class-transformer';
import { Exam } from 'src/exam/entities/exam.entity';
import { ExamScore } from './entities/exam_score.entity';

@Injectable()
export class ScoringService {
    constructor(
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,
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

        await this.messageBrokerService.publishMessage(processedData);

        return processedData;
    }
}
