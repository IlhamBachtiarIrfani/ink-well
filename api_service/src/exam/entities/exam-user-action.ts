import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ExamAccess } from 'src/exam/entities/exam-access.entity';

export enum ExamUserActionEnum {
    JOINED = 'JOINED',
    LEAVED = 'LEAVED',
    FOCUSED = 'FOCUSED',
    BLURRED = 'BLURRED',
    START_TYPING = 'START_TYPING',
    STOP_TYPING = 'STOP_TYPING',
    CHANGE_QUESTION = 'CHANGE_QUESTION',
    ON_COPY = 'ON_COPY',
    ON_PASTE = 'ON_PASTE',
}

// ! EXAM ENTITY
@Entity({ name: 'exam_user_action' })
export class ExamUserAction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    user_id: string;

    @Column('uuid')
    exam_id: string;

    @Column({ type: 'enum', enum: ExamUserActionEnum })
    action: ExamUserActionEnum;

    @Column({ type: 'json', nullable: true })
    detail: JSON;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => ExamAccess, (examAccess: ExamAccess) => examAccess.action)
    @JoinColumn([
        { name: 'user_id', referencedColumnName: 'user_id' },
        { name: 'exam_id', referencedColumnName: 'exam_id' },
    ])
    examAccess: ExamAccess;
}
