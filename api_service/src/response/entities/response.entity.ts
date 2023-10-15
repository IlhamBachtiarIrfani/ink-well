import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { ResponseScore } from './response-score.entity';
import { ResponseHistory } from './response-history.entity';

// ! EXAM ENTITY
@Entity({ name: 'response' })
export class Response {
    @PrimaryColumn('uuid')
    question_id: string;

    @PrimaryColumn('uuid')
    user_id: string;

    @Column({ type: 'text' })
    content: string;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Question, (question: Question) => question.response)
    @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
    question: Question;

    @ManyToOne(() => User, (user: User) => user.response)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @OneToOne(
        () => ResponseScore,
        (responseScore: ResponseScore) => responseScore.response,
    )
    @JoinColumn([
        { name: 'user_id', referencedColumnName: 'user_id' },
        { name: 'question_id', referencedColumnName: 'question_id' },
    ])
    score: ResponseScore;

    @OneToMany(
        () => ResponseHistory,
        (responseHistory: ResponseHistory) => responseHistory.response,
    )
    @JoinColumn([
        { name: 'user_id', referencedColumnName: 'user_id' },
        { name: 'question_id', referencedColumnName: 'question_id' },
    ])
    response_history: ResponseHistory[];
}
