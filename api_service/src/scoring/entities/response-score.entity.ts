import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserResponse } from 'src/user-response/entities/user-response.entity';

// ! EXAM ENTITY
@Entity({ name: 'response_score' })
export class ResponseScore {
    @PrimaryColumn('uuid')
    user_id: string;

    @PrimaryColumn('uuid')
    question_id: string;

    @Column({ type: 'double' })
    final_score: number;

    @Column({ type: 'json' })
    detail_score: JSON;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;

    @OneToOne(
        () => UserResponse,
        (userResponse: UserResponse) => userResponse.response_history,
    )
    @JoinColumn([
        { name: 'user_id', referencedColumnName: 'user_id' },
        { name: 'question_id', referencedColumnName: 'question_id' },
    ])
    response: UserResponse;
}
