import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import {
    ExamUserAction,
    ExamUserActionEnum,
} from 'src/exam/entities/exam-user-action';
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
        @InjectRepository(ExamUserAction)
        private examUserActionRepository: Repository<ExamUserAction>,
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
            .orderBy('question.created_at', 'ASC')
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

    async sendAction(
        user_id: string,
        exam_id: string,
        action: string,
        detail: any,
    ) {
        const userActionData: ExamUserActionEnum | undefined = (
            ExamUserActionEnum as any
        )[action as any];

        if (!userActionData) {
            throw new WsException('INVALID ACTION');
        }

        const userAction = new ExamUserAction();
        userAction.action = userActionData;
        userAction.detail = detail;
        userAction.user_id = user_id;
        userAction.exam_id = exam_id;

        return this.examUserActionRepository.save(userAction);
    }
}
