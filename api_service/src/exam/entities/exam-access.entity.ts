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

// ! EXAM ACCESS ENUM
export enum ExamAccessType {
    ADMIN = 'ADMIN',
    PARTICIPANT = 'PARTICIPANT',
}

// ! EXAM ENTITY
@Entity({ name: 'exam_access' })
export class ExamAccess {
    @PrimaryColumn('uuid')
    exam_id: string;

    @PrimaryColumn('uuid')
    user_id: string;

    @Column({
        type: 'enum',
        enum: ExamAccessType,
        default: ExamAccessType.PARTICIPANT,
    })
    type: ExamAccessType;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    socket_id: string;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Exam, (exam: Exam) => exam.exam_access)
    @JoinColumn({ name: 'exam_id', referencedColumnName: 'id' })
    exam: Exam;

    @ManyToOne(() => User, (user: User) => user.exam_access)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
}
