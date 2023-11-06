import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamAccess } from 'src/exam/entities/exam-access.entity';
import { Exam } from 'src/exam/entities/exam.entity';
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
                .leftJoinAndSelect('exam_access.user', 'user')
                .orderBy(
                    'CASE WHEN exam_access.socket_id IS NULL THEN 1 ELSE 0 END',
                    'ASC',
                )
                .addOrderBy('exam_access.updated_at', 'DESC')
                .getMany();
            // return await this.examAccessRepository.find({
            //     where: { exam_id: examId },
            //     relations: ['user'],
            //     order: {
            //         updated_at: 'DESC',
            //     },
            // });
        } catch (error) {
            console.error(error);
        }
    }
}
