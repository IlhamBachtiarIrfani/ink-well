import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Exam } from './exam.entity';
import { User } from 'src/user/entities/user.entity';

// ! EXAM SCORE ENTITY
@Entity({ name: 'exam_score' })
export class ExamScore {
    @PrimaryColumn('uuid')
    exam_id: string;

    @PrimaryColumn('uuid')
    user_id: string;

    @Column({ type: 'double' })
    final_score: number;

    @Column({ type: 'json' })
    detail_score: string;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Exam, (exam: Exam) => exam.exam_score)
    @JoinColumn({ name: 'exam_id', referencedColumnName: 'id' })
    exam: Exam;

    @ManyToOne(() => User, (user: User) => user.exam_score)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
}
