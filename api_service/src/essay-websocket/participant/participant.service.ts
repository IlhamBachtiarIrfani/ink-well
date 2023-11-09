import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInSeconds } from 'date-fns';
import { Exam } from 'src/exam/entities/exam.entity';
import { Question } from 'src/question/entities/question.entity';
import { UserResponse } from 'src/user-response/entities/user-response.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParticipantService {
    constructor(
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,
        @InjectRepository(UserResponse)
        private userResponseRepository: Repository<UserResponse>,
    ) {}

    async getAllQuestion(quiz_id: string, user_id: string) {
        return await this.questionRepository
            .createQueryBuilder('question')
            .select(['question.id', 'question.content'])
            .leftJoinAndMapOne(
                'question.user_response',
                'question.response',
                'response',
                'response.user_id = :user_id',
                { user_id: user_id },
            )
            .where('question.exam_id = :exam_id', { exam_id: quiz_id })
            .orderBy('question.created_at')
            .getMany();
    }

    async getAllQuestionGuest(quiz_id: string) {
        return await this.questionRepository
            .createQueryBuilder('question')
            .select(['question.id', 'question.content'])
            .where('question.exam_id = :exam_id', { exam_id: quiz_id })
            .orderBy('question.created_at')
            .getMany();
    }

    async sendResponse(question_id: string, user_id: string, response: string) {
        let responseData = await this.userResponseRepository.findOne({
            where: {
                user_id: user_id,
                question_id: question_id,
            },
        });

        if (!responseData) {
            responseData = new UserResponse();
            responseData.question_id = question_id;
            responseData.user_id = user_id;
        }

        responseData.content = response;

        return this.userResponseRepository.save(responseData);
    }
}
