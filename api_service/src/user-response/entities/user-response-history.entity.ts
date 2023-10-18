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
import { UserResponse } from './user-response.entity';

// ! EXAM ENTITY
@Entity({ name: 'response_history' })
export class UserResponseHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    user_id: string;

    @Column('uuid')
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

    @ManyToOne(
        () => UserResponse,
        (userResponse: UserResponse) => userResponse.response_history,
    )
    @JoinColumn([
        { name: 'user_id', referencedColumnName: 'user_id' },
        { name: 'question_id', referencedColumnName: 'question_id' },
    ])
    response: UserResponse;
}
