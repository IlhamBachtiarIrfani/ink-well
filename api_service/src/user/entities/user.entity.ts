import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
    ADMIN = 'ADMIN',
    PARTICIPANT = 'PARTICIPANT',
}

// ! JWT TOKEN INTERFACE
export type UserTokenData = {
    user_id: string;
    user_email: string;
    user_name: string;
    user_role: string;
};

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.PARTICIPANT })
    role: UserRole;

    @Exclude()
    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;
}
