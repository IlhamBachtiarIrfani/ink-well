import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ExamAccess } from './exam-access.entity';
import { Question } from 'src/question/entities/question.entity';

// ! EXAM STATE ENUM
export enum ExamState {
    FINISHED = 'FINISHED',
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    STARTED = 'STARTED',
}

// ! EXAM ENTITY
@Entity({ name: 'exam' })
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({ type: 'text' })
    desc: string;

    @Column({ default: 60 })
    duration_in_minutes: number;

    @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
    joinCode?: string;

    @Column({ type: 'enum', enum: ExamState, default: ExamState.DRAFT })
    state: ExamState;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => ExamAccess, (examAccess: ExamAccess) => examAccess.exam)
    exam_access: ExamAccess[];

    @OneToMany(() => Question, (question: Question) => question.exam)
    question: Question[];
}
