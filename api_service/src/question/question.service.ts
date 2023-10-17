import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamService } from 'src/exam/exam.service';
import { UserTokenData } from 'src/user/entities/user.entity';
import { QuestionKeyword } from './entities/question-keyword';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
        @InjectRepository(QuestionKeyword)
        private questionKeywordRepository: Repository<QuestionKeyword>,
        private examService: ExamService,
    ) {}

    async create(
        userTokenData: UserTokenData,
        examId: string,
        createQuestionDto: CreateQuestionDto,
    ) {
        await this.examService.checkUserAccess(userTokenData, examId);

        const newQuestionData = new Question();
        newQuestionData.content = createQuestionDto.content;
        newQuestionData.answer_key = createQuestionDto.answer_key;
        newQuestionData.exam_id = examId;

        await this.questionRepository.save(newQuestionData);

        Promise.all(
            createQuestionDto.keyword.map((keyword) => {
                const newKeywordData = new QuestionKeyword();
                newKeywordData.keyword = keyword;
                newKeywordData.question_id = newQuestionData.id;

                this.questionKeywordRepository.save(newKeywordData);
            }),
        );

        return newQuestionData;
    }

    async findAll(userTokenData: UserTokenData, examId: string) {
        await this.examService.checkUserAccess(userTokenData, examId);

        return this.questionRepository.find({
            where: { exam_id: examId },
        });
    }

    async findOne(
        userTokenData: UserTokenData,
        examId: string,
        questionId: string,
    ) {
        await this.examService.checkUserAccess(userTokenData, examId);

        const questionData = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.keyword', 'keyword')
            .leftJoinAndSelect('question.response', 'response')
            .where('question.exam_id = :examId AND question.id = :id', {
                examId: examId,
                id: questionId,
            })
            .getMany();

        // .findOne({
        //     where: { exam_id: examId, id: questionId },
        //     relations: ['keyword', 'response'],
        // });

        if (!questionData) {
            throw new BadRequestException('QUESTION_NOT_FOUND');
        }

        return questionData;
    }

    async update(
        userTokenData: UserTokenData,
        examId: string,
        questionId: string,
        updateQuestionDto: UpdateQuestionDto,
    ) {
        await this.examService.checkUserAccess(userTokenData, examId);
        return `This action updates a # question`;
    }

    async remove(
        userTokenData: UserTokenData,
        examId: string,
        questionId: string,
    ) {
        await this.examService.checkUserAccess(userTokenData, examId);
        return `This action removes a # question`;
    }
}
