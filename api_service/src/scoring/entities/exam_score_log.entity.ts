import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Exam } from 'src/exam/entities/exam.entity';

// ! EXAM ENTITY
@Entity({ name: 'exam_score_log' })
export class ExamScoreLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    exam_id: string;

    @Column({ nullable: true })
    progress_type: string;

    @Column({ type: 'float', nullable: true })
    progress_percent: number;

    @Column({ nullable: true })
    progress_detail: string;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Exam, (exam: Exam) => exam.score_log)
    @JoinColumn({ name: 'exam_id', referencedColumnName: 'id' })
    exam: Exam;
}
