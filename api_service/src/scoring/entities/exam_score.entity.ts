import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Exam } from 'src/exam/entities/exam.entity';

export enum ExamScoreStatus {
    ON_QUEUE = 'ON_QUEUE',
    ON_PROGRESS = 'ON_PROGRESS',
    DONE = 'DONE',
    ERROR = 'ERROR',
}

// ! EXAM ENTITY
@Entity({ name: 'exam_score' })
export class ExamScore {
    @PrimaryColumn()
    exam_id: string;

    @Column({
        type: 'enum',
        enum: ExamScoreStatus,
        default: ExamScoreStatus.ON_QUEUE,
    })
    status: ExamScoreStatus;

    @Column({ type: 'json', nullable: true })
    distribution_data: JSON;

    @Column({ type: 'double', nullable: true })
    pass_rate: number;

    @Column({ type: 'double', nullable: true })
    minScore: number;

    @Column({ type: 'double', nullable: true })
    maxScore: number;

    @Column({ type: 'double', nullable: true })
    avgScore: number;

    @Column({ type: 'double', nullable: true })
    q1Score: number;

    @Column({ type: 'double', nullable: true })
    q2Score: number;

    @Column({ type: 'double', nullable: true })
    q3Score: number;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;

    @OneToOne(() => Exam, (exam: Exam) => exam.score)
    @JoinColumn({ name: 'exam_id', referencedColumnName: 'id' })
    exam: Exam;
}
