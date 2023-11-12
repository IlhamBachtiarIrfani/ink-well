import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Question } from 'src/question/entities/question.entity';

enum QuestionScoreStatus {
    ON_QUEUE = 'ON_QUEUE',
    ON_PROGRESS = 'ON_PROGRESS',
    DONE = 'DONE',
    ERROR = 'ERROR',
}

// ! EXAM ENTITY
@Entity({ name: 'question_score' })
export class QuestionScore {
    @PrimaryColumn()
    question_id: string;

    @Column({
        type: 'enum',
        enum: QuestionScoreStatus,
        default: QuestionScoreStatus.ON_QUEUE,
    })
    status: QuestionScoreStatus;

    @Column({ type: 'json', nullable: true })
    criteria_weights: JSON;

    @Column({ type: 'json', nullable: true })
    distribution_data: JSON;

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

    @OneToOne(() => Question, (question: Question) => question.score)
    @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
    question: Question;
}
