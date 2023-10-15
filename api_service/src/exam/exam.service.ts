import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam, ExamState } from './entities/exam.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    async create(userTokenData: UserTokenData, createExamDto: CreateExamDto) {
        const newExamData = new Exam();
        newExamData.title = createExamDto.title;
        newExamData.desc = createExamDto.desc;
        newExamData.duration_in_second = createExamDto.duration_in_second;

        await this.examRepository.save(newExamData);

        const newExamAccess = new ExamAccess();
        newExamAccess.exam_id = newExamData.id;
        newExamAccess.user_id = userTokenData.user_id;
        newExamAccess.type = ExamAccessType.ADMIN;

        await this.examAccessRepository.save(newExamAccess);

        return newExamData;
    }

    findAll(userTokenData: UserTokenData) {
        return this.examRepository.find({
            where: {
                exam_access: {
                    user_id: userTokenData.user_id,
                    user: { role: UserRole.ADMIN },
                },
            },
        });
    }

    findOne(userTokenData: UserTokenData, examId: string) {
        return this.checkUserAccess(userTokenData, examId);
    }

    async update(
        userTokenData: UserTokenData,
        examId: string,
        updateExamDto: UpdateExamDto,
    ) {
        const examData = await this.checkUserAccess(userTokenData, examId);

        if (examData.state != ExamState.DRAFT) {
            throw new BadRequestException('EXAM_IS_NOT_DRAFT');
        }

        examData.title = updateExamDto.title;
        examData.desc = updateExamDto.desc;
        examData.duration_in_second = updateExamDto.duration_in_second;

        await this.examRepository.save(examData);

        return examData;
    }

    async remove(userTokenData: UserTokenData, examId: string) {
        const examData = await this.checkUserAccess(userTokenData, examId);

        if (examData.state == ExamState.STARTED) {
            throw new BadRequestException('EXAM_IS_STARTED');
        }

        console.log(examData);

        await this.examRepository.softRemove(examData);

        return 'EXAM_DELETED';
    }

    private async checkUserAccess(
        userTokenData: UserTokenData,
        examId: string,
    ) {
        const examData = await this.examRepository.findOne({
            where: {
                id: examId,
                exam_access: {
                    user_id: userTokenData.user_id,
                    user: { role: UserRole.ADMIN },
                },
            },
        });

        if (!examData) {
            throw new BadRequestException('EXAM_NOT_FOUND');
        }

        return examData;
    }
}
