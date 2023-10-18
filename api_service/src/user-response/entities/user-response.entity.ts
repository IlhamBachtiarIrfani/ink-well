import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { Question } from 'src/question/entities/question.entity';
import { UserResponseHistory } from './user-response-history.entity';

// ! EXAM ENTITY
@Entity({ name: 'response' })
export class UserResponse {
    @PrimaryColumn('uuid')
    user_id: string;

    @PrimaryColumn('uuid')
    question_id: string;

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

    @ManyToOne(() => User, (user: User) => user.response)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @ManyToOne(() => Question, (question: Question) => question.response)
    @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
    question: Question;

    @OneToMany(
        () => UserResponseHistory,
        (userResponseHistory: UserResponseHistory) =>
            userResponseHistory.response,
    )
    response_history: UserResponseHistory[];
}
