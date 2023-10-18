import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { UserResponse } from './entities/user-response.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';
import { Repository } from 'typeorm';
import { Exam } from 'src/exam/entities/exam.entity';
import { UserTokenData } from 'src/user/entities/user.entity';

@Injectable()
export class UserResponseService {
    constructor(
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
        @InjectRepository(UserResponse)
        private userResponseRepository: Repository<UserResponse>,
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,
    ) {}

    async create(
        userTokenData: UserTokenData,
        examId: string,
        questionId: string,
        createUserResponseDto: CreateUserResponseDto,
    ) {
        await this.checkUserAccess(userTokenData, examId, questionId);

        const oldResponseData = await this.userResponseRepository.findOne({
            where: {
                user_id: userTokenData.user_id,
                question_id: questionId,
            },
        });

        if (!oldResponseData) {
            const newResponseData = new UserResponse();
            newResponseData.question_id = questionId;
            newResponseData.user_id = userTokenData.user_id;
            newResponseData.content = createUserResponseDto.content;
        }

        oldResponseData.content = createUserResponseDto.content;

        return this.userResponseRepository.save(oldResponseData);
    }

    async checkUserAccess(
        userTokenData: UserTokenData,
        examId: string,
        questionId: string,
    ) {
        // make a query
        const examData = await this.examRepository.findOne({
            where: {
                id: examId,
                exam_access: {
                    user_id: userTokenData.user_id,
                },
            },
        });

        // check if exam exist
        if (!examData) {
            throw new BadRequestException('EXAM_NOT_FOUND');
        }

        const questionData = await this.questionRepository.findOne({
            where: {
                id: questionId,
                exam_id: examId,
            },
        });

        // return exam data
        return { examData, questionData };
    }
}
