import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes } from 'date-fns';
import {
    ExamAccess,
    ExamAccessType,
} from 'src/exam/entities/exam-access.entity';
import { Exam, ExamState } from 'src/exam/entities/exam.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class EssayWebsocketService {
    constructor(
        @InjectRepository(Exam)
        private examRepository: Repository<Exam>,
        @InjectRepository(ExamAccess)
        private examAccessRepository: Repository<ExamAccess>,
    ) {}

    async getExamData(quiz_id: string) {
        const data = await this.examRepository.findOneOrFail({
            where: { id: quiz_id },
        });

        const finish_time = addMinutes(
            data.started_at,
            data.duration_in_minutes,
        );

        return { data, finish_time };
    }

    async checkQuizId(
        quiz_id: string,
        user_id: string,
        type: ExamAccessType,
        socket_id: string,
    ) {
        const data = await this.examAccessRepository.findOneOrFail({
            where: {
                exam_id: quiz_id,
                user_id: user_id,
                type: type,
                exam: {
                    state: In([ExamState.ACTIVE, ExamState.STARTED]),
                },
            },
            relations: ['exam'],
        });

        data.socket_id = socket_id;

        return this.examAccessRepository.save(data);
    }

    async leaveQuizId(quiz_id: string, user_id: string) {
        const data = await this.examAccessRepository.findOneOrFail({
            where: {
                exam_id: quiz_id,
                user_id: user_id,
            },
        });

        data.socket_id = null;

        return this.examAccessRepository.save(data);
    }
}
