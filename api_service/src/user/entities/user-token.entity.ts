import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';

// ! USER ENTITY
@Entity({ name: 'user_token' })
export class UserToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column({ type: 'text' })
    token: string;

    @Column({ type: 'datetime' })
    expired_at: Date;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.user_token)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
}
