import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { Exam } from 'src/exam/entities/exam.entity';
import { QuestionKeyword } from './question-keyword';
import { UserResponse } from 'src/user-response/entities/user-response.entity';

// ! EXAM ENTITY
@Entity({ name: 'question' })
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    exam_id: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'text' })
    answer_key: string;

    @Column({ default: 1 })
    point: number;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Exam, (exam: Exam) => exam.question)
    @JoinColumn({ name: 'exam_id', referencedColumnName: 'id' })
    exam: Exam;

    @OneToMany(
        () => QuestionKeyword,
        (questionKeyword: QuestionKeyword) => questionKeyword.question,
    )
    @Transform(({ value }) => value.map((keyword) => keyword.keyword))
    keyword: QuestionKeyword[];

    @OneToMany(
        () => UserResponse,
        (userResponse: UserResponse) => userResponse.question,
    )
    response: UserResponse[];
}
