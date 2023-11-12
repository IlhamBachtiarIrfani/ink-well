import {
    Injectable,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { DataSource, In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamService } from 'src/exam/exam.service';
import { UserTokenData } from 'src/user/entities/user.entity';
import { QuestionKeyword } from './entities/question-keyword.entitiy';
import { ExamState } from 'src/exam/entities/exam.entity';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
        @InjectRepository(QuestionKeyword)
        private questionKeywordRepository: Repository<QuestionKeyword>,
        private examService: ExamService,
        private dataSource: DataSource,
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
        newQuestionData.point = createQuestionDto.point;
        newQuestionData.exam_id = examId;

        // Use QueryRunner for manage transaction
        const queryRunner = this.dataSource.createQueryRunner();

        // Connect QueryRunner and start transaction
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(newQuestionData);

            await Promise.all(
                createQuestionDto.keyword.map((keyword) => {
                    const newKeywordData = new QuestionKeyword();
                    newKeywordData.keyword = keyword;
                    newKeywordData.question_id = newQuestionData.id;

                    queryRunner.manager.save(newKeywordData);
                }),
            );

            // Commit transaction
            await queryRunner.commitTransaction();

            return newQuestionData;
        } catch (err) {
            // If there any error, rollback transaction and throw InternalServerErrorException
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException();
        } finally {
            // Close QueryRunner
            await queryRunner.release();
        }
    }

    async findAll(userTokenData: UserTokenData, examId: string) {
        await this.examService.checkUserAccess(userTokenData, examId);

        return this.questionRepository.find({
            where: { exam_id: examId },
            relations: ['keyword'],
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
            .getOne();

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
        const examData = await this.examService.checkUserAccess(
            userTokenData,
            examId,
        );

        if (examData.state != ExamState.DRAFT) {
            throw new BadRequestException('EXAM_IS_NOT_DRAFT');
        }

        const questionData = await this.questionRepository.findOne({
            where: { id: questionId },
        });

        if (!questionData) {
            throw new BadRequestException('QUESTION_NOT_FOUND');
        }

        questionData.content = updateQuestionDto.content;
        questionData.answer_key = updateQuestionDto.answer_key;
        questionData.point = updateQuestionDto.point;

        // get existing keyword in database
        const existingKeywords = await this.questionKeywordRepository.find({
            where: {
                question_id: questionId,
                keyword: In(updateQuestionDto.keyword),
            },
        });

        // get list keyword data string only
        const existingKeywordStrings = await existingKeywords.map(
            (keyword) => keyword.keyword,
        );

        // get the new keyword between existing keyword and requested keyword
        const newKeywords = await updateQuestionDto.keyword.filter(
            (keyword) => !existingKeywordStrings.includes(keyword),
        );

        // create new question keyword objects
        const keywordEntities = await newKeywords.map((keyword) => {
            const questionKeyword = new QuestionKeyword();
            questionKeyword.question_id = questionId;
            questionKeyword.keyword = keyword;

            return questionKeyword;
        });

        // Use QueryRunner for manage transaction
        const queryRunner = this.dataSource.createQueryRunner();

        // Connect QueryRunner and start transaction
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Save updated question data
            await queryRunner.manager.save(questionData);

            // Delete unwanted keyword
            await queryRunner.manager.delete(QuestionKeyword, {
                question_id: questionId,
                keyword: Not(In(updateQuestionDto.keyword)),
            });

            // Save new question keyword
            await queryRunner.manager.save(keywordEntities);

            // Commit transaction
            await queryRunner.commitTransaction();

            return questionData;
        } catch (err) {
            // If there any error, rollback transaction and throw InternalServerErrorException
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException();
        } finally {
            // Close QueryRunner
            await queryRunner.release();
        }
    }

    async remove(
        userTokenData: UserTokenData,
        examId: string,
        questionId: string,
    ) {
        const examData = await this.examService.checkUserAccess(
            userTokenData,
            examId,
        );

        if (examData.state != ExamState.DRAFT) {
            throw new BadRequestException('EXAM_IS_NOT_DRAFT');
        }

        const questionData = await this.questionRepository.findOne({
            where: { id: questionId },
        });

        if (!questionData) {
            throw new BadRequestException('QUESTION_NOT_FOUND');
        }

        await this.questionRepository.softRemove(questionData);

        return `QUESTION_DELETED`;
    }
}
