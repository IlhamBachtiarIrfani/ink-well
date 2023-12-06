import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam, ExamState } from './entities/exam.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ExamAccess, ExamAccessType } from './entities/exam-access.entity';
import { UserRole, UserTokenData } from 'src/user/entities/user.entity';

@Injectable()
export class ExamService {
    constructor(
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,
        @InjectRepository(ExamAccess)
        private examAccessRepository: Repository<ExamAccess>,
    ) {}

    // ! ===== CREATE NEW EXAM =====
    async create(userTokenData: UserTokenData, createExamDto: CreateExamDto) {
        // create new exam data
        const newExamData = new Exam();
        newExamData.title = createExamDto.title;
        newExamData.desc = createExamDto.desc;
        newExamData.duration_in_minutes = createExamDto.duration_in_minutes;
        newExamData.pass_score = createExamDto.pass_score;

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
    async findAll(userTokenData: UserTokenData) {
        const examList = await this.examAccessRepository.find({
            where: {
                user_id: userTokenData.user_id,
                type: ExamAccessType.ADMIN,
            },
        });

        const examIdList = examList.map((item) => item.exam_id);

        if (examIdList.length == 0) {
            return [];
        }

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
            .where('exam.id IN (:exam_array)', { exam_array: examIdList })
            .getMany();
    }

    // ! ===== GET DETAIL OF EXAM =====
    async findOne(userTokenData: UserTokenData, examId: string) {
        // check user access
        await this.checkUserAccess(userTokenData, examId);

        return this.examRepository
            .createQueryBuilder('exam')
            .leftJoinAndSelect('exam.question', 'question')
            .leftJoinAndSelect('question.keyword', 'keyword')
            .leftJoinAndSelect('exam.exam_access', 'exam_access')
            .leftJoinAndSelect('exam_access.user', 'user')
            .loadRelationCountAndMap(
                'exam.question_count',
                'exam.question',
                'question',
            )
            .where('exam.id = :examId', { examId: examId })
            .orderBy('question.created_at', 'ASC')
            .addOrderBy('exam_access.updated_at', 'DESC')
            .getOne();
    }

    async activate(userTokenData: UserTokenData, examId: string) {
        const examData = await this.checkUserAccess(userTokenData, examId);

        if (examData.state == ExamState.FINISHED) {
            throw new BadRequestException('Exam Already Finished');
        }

        if (examData.state == ExamState.DRAFT) {
            await this.examRepository.query(
                `
            UPDATE exam
            SET join_code = GenerateUniqueRandomCode(), state = 'ACTIVE'
            WHERE id = ?
          `,
                [examId],
            );
        }

        return this.findOne(userTokenData, examId);
    }

    async join(userTokenData: UserTokenData, join_code: string) {
        const examData = await this.examRepository.findOne({
            where: {
                join_code: join_code,
                state: In([ExamState.ACTIVE, ExamState.STARTED]),
            },
        });

        if (!examData) {
            throw new NotFoundException('EXAM_NOT_FOUND');
        }

        const accessData = await this.examAccessRepository.findOne({
            where: {
                exam_id: examData.id,
                user_id: userTokenData.user_id,
            },
        });

        if (!accessData) {
            const newAccessData = new ExamAccess();
            newAccessData.exam_id = examData.id;
            newAccessData.user_id = userTokenData.user_id;
            newAccessData.type = ExamAccessType.PARTICIPANT;

            await this.examAccessRepository.save(newAccessData);
        }

        return examData;
    }

    async deactivate(userTokenData: UserTokenData, examId: string) {
        const examData = await this.checkUserAccess(userTokenData, examId);

        if (examData.state != ExamState.ACTIVE) {
            throw new BadRequestException("Exam Isn't In Active State");
        }

        examData.join_code = null;
        examData.state = ExamState.DRAFT;

        return this.examRepository.save(examData);
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
        examData.pass_score = updateExamDto.pass_score;

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

    // ! ===== FIND ALL EXAM THAT HAVE ACCESS WITH USER =====
    async history(userTokenData: UserTokenData) {
        // make query and return
        return this.examAccessRepository
            .createQueryBuilder('exam_access')
            .leftJoinAndSelect('exam_access.exam', 'exam')
            .leftJoinAndSelect('exam_access.score', 'exam_score')
            .where(
                'exam_access.user_id = :user_id AND exam_access.type = "PARTICIPANT" AND exam.state = "FINISHED"',
                {
                    user_id: userTokenData.user_id,
                },
            )
            .getMany();
    }
}
