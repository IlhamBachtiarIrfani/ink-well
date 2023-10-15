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

// ! EXAM STATE ENUM
export enum ExamState {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    STARTED = 'STARTED',
    FINISHED = 'FINISHED',
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
    duration_in_second: number;

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
}
