import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { ExamAccess } from 'src/exam/entities/exam-access.entity';
import { Exam, ExamState } from 'src/exam/entities/exam.entity';
import { UserRole, UserTokenData } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,
        @InjectRepository(ExamAccess)
        private examAccessRepository: Repository<ExamAccess>,
    ) {}

    async getCurrentAccess(examId: string) {
        try {
            return await this.examAccessRepository
                .createQueryBuilder('exam_access')
                .where('exam_access.exam_id = :exam_id', { exam_id: examId })
                // .andWhere('exam_access.type = "PARTICIPANT"')
                .leftJoinAndSelect('exam_access.user', 'user')
                .orderBy(
                    'CASE WHEN exam_access.socket_id IS NULL THEN 1 ELSE 0 END',
                    'ASC',
                )
                .addOrderBy('exam_access.updated_at', 'DESC')
                .getMany();
        } catch (error) {
            throw new WsException('INTERNAL_SERVER_ERROR');
        }
    }

    async startQuiz(userTokenData: UserTokenData, examId: string) {
        const examData = await this.checkUserAccess(userTokenData, examId);

        if (examData.state != ExamState.ACTIVE) {
            throw new WsException('EXAM_IS_NOT_ACTIVE');
        }

        examData.state = ExamState.STARTED;
        examData.started_at = new Date();
        return await this.examRepository.save(examData);
    }

    async finishQuiz(userTokenData: UserTokenData, examId: string) {
        const examData = await this.checkUserAccess(userTokenData, examId);

        if (examData.state != ExamState.STARTED) {
            throw new WsException('EXAM_IS_NOT_STARTED');
        }

        examData.state = ExamState.FINISHED;
        return await this.examRepository.save(examData);
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
            throw new WsException('EXAM_NOT_FOUND');
        }

        // return exam data
        return examData;
    }
}
