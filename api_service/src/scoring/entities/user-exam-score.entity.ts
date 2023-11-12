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
import { ExamAccess } from 'src/exam/entities/exam-access.entity';

// ! EXAM ENTITY
@Entity({ name: 'user_exam_score' })
export class UserExamScore {
    @PrimaryColumn('uuid')
    user_id: string;

    @PrimaryColumn('uuid')
    exam_id: string;

    @Column({ type: 'double' })
    final_score: number;

    @Column({ type: 'double' })
    score_percentage: number;

    @Column({ type: 'bool' })
    is_pass: boolean;

    @Column({ type: 'json' })
    detail_score: JSON;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;

    @OneToOne(() => ExamAccess, (examAccess: ExamAccess) => examAccess.score)
    @JoinColumn([
        { name: 'user_id', referencedColumnName: 'user_id' },
        { name: 'exam_id', referencedColumnName: 'exam_id' },
    ])
    examAccess: ExamAccess;
}
