import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { Response } from './response.entity';

// ! EXAM ENTITY
@Entity({ name: 'response_score' })
export class ResponseScore {
    @PrimaryColumn('uuid')
    question_id: string;

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

    @ManyToOne(() => Question, (question: Question) => question.response_score)
    @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
    question: Question;

    @ManyToOne(() => User, (user: User) => user.response_score)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @OneToOne(() => Response, (response: Response) => response.score)
    response: Response;
}
