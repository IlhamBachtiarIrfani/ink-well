import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { Response } from './response.entity';

// ! EXAM ENTITY
@Entity({ name: 'response_history' })
export class ResponseHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    question_id: string;

    @Column('uuid')
    user_id: string;

    @Column({ type: 'text' })
    content: string;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(
        () => Question,
        (question: Question) => question.response_history,
    )
    @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
    question: Question;

    @ManyToOne(() => User, (user: User) => user.response_history)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @ManyToOne(
        () => Response,
        (response: Response) => response.response_history,
    )
    response: Response;
}
