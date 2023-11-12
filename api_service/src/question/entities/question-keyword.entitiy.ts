import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Question } from './question.entity';

// ! EXAM ENTITY
@Entity({ name: 'question_keyword' })
export class QuestionKeyword {
    @PrimaryColumn()
    question_id: string;

    @PrimaryColumn()
    keyword: string;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Question, (question: Question) => question.keyword)
    @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
    question: Question;
}
