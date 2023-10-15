import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserToken } from './user-token.entity';
import { ExamAccess } from 'src/exam/entities/exam-access.entity';

// ! USER ROLE ENUM
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

// ! USER ENTITY
@Entity({ name: 'user' })
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

    @OneToMany(() => UserToken, (userToken: UserToken) => userToken.user)
    user_token: UserToken[];

    @OneToMany(() => ExamAccess, (examAccess: ExamAccess) => examAccess.user)
    exam_access: ExamAccess[];
}
