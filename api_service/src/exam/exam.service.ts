import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam, ExamState } from './entities/exam.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamAccess, ExamAccessType } from './entities/exam-access.entity';
import { UserRole, UserTokenData } from 'src/user/entities/user.entity';
import { MessageBrokerService } from 'src/message_broker/message_broker.service';
import { classToPlain } from 'class-transformer';

@Injectable()
export class ExamService {
    constructor(
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,
        @InjectRepository(ExamAccess)
        private examAccessRepository: Repository<ExamAccess>,
        private messageBrokerService: MessageBrokerService,
    ) {}

    // ! ===== CREATE NEW EXAM =====
    async create(userTokenData: UserTokenData, createExamDto: CreateExamDto) {
        // create new exam data
        const newExamData = new Exam();
        newExamData.title = createExamDto.title;
        newExamData.desc = createExamDto.desc;
        newExamData.duration_in_minutes = createExamDto.duration_in_minutes;

        // save exam data to db
        await this.examRepository.save(newExamData);

        // create new exam access
        const newExamAccess = new ExamAccess();
        newExamAccess.exam_id = newExamData.id;
        newExamAccess.user_id = userTokenData.user_id;
        newExamAccess.type = ExamAccessType.ADMIN;

        // save exam access to db
        await this.examAccessRepository.save(newExamAccess);

        // return exam data
        return newExamData;
    }

    // ! ===== FIND ALL EXAM THAT HAVE ACCESS WITH USER =====
    findAll(userTokenData: UserTokenData) {
        // make query and return
        return this.examRepository
            .createQueryBuilder('exam')
            .loadRelationCountAndMap(
                'exam.question_count',
                'exam.question',
                'question',
            )
            .orderBy('exam.state', 'DESC')
            .addOrderBy('exam.created_at', 'DESC')
            .getMany();
        // return this.examRepository.find({
        //     order: {
        //         state: 'DESC',
        //         created_at: 'DESC',
        //     },
        //     where: {
        //         exam_access: {
        //             user_id: userTokenData.user_id,
        //             user: { role: UserRole.ADMIN },
        //         },
        //     },
        // });
    }

    // ! ===== GET DETAIL OF EXAM =====
    findOne(userTokenData: UserTokenData, examId: string) {
        // check user access
        this.checkUserAccess(userTokenData, examId);

        return this.examRepository
            .createQueryBuilder('exam')
            .leftJoinAndSelect('exam.question', 'question')
            .leftJoinAndSelect('question.keyword', 'keyword')
            .leftJoinAndSelect('exam.exam_access', 'exam_access')
            .leftJoinAndSelect('exam_access.user', 'user')
            .where('exam.id = :examId', { examId: examId })
            .orderBy('question.created_at', 'ASC')
            .getOne();
    }

    // ! ===== UPDATE EXAM =====
    async update(
        userTokenData: UserTokenData,
        examId: string,
        updateExamDto: UpdateExamDto,
    ) {
        // check user access
        const examData = await this.checkUserAccess(userTokenData, examId);

        // check if exam in draft state
        if (examData.state != ExamState.DRAFT) {
            throw new BadRequestException('EXAM_IS_NOT_DRAFT');
        }

        // update exam data
        examData.title = updateExamDto.title;
        examData.desc = updateExamDto.desc;
        examData.duration_in_minutes = updateExamDto.duration_in_minutes;

        // save data to db
        await this.examRepository.save(examData);

        // return data
        return examData;
    }

    // ! ===== DELETE EXAM =====
    async remove(userTokenData: UserTokenData, examId: string) {
        // check user access
        const examData = await this.checkUserAccess(userTokenData, examId);

        // check if exam not draft (draft, active, or finished)
        if (examData.state == ExamState.STARTED) {
            throw new BadRequestException('EXAM_IS_STARTED');
        }

        // delete data
        await this.examRepository.softRemove(examData);

        // return message
        return 'EXAM_DELETED';
    }

    // ! ===== CHECK USER ADMIN ACCESS
    async checkUserAccess(userTokenData: UserTokenData, examId: string) {
        // make a query
        const examData = await this.examRepository.findOne({
            where: {
                id: examId,
                exam_access: {
                    user_id: userTokenData.user_id,
                    user: { role: UserRole.ADMIN },
                },
            },
        });

        // check if exam exist
        if (!examData) {
            throw new BadRequestException('EXAM_NOT_FOUND');
        }

        // return exam data
        return examData;
    }

    async correctionOutput(examId: string) {
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

        await this.messageBrokerService.publishMessage(processedData);

        return processedData;
    }
}
