import { Module } from '@nestjs/common';
import { UserResponseService } from './user-response.service';
import { UserResponseController } from './user-response.controller';
import { MyJwtModule } from 'src/config/my-jwt/my-jwt.module';
import { MariaDbDatabaseModule } from 'src/config/database/mariadb-database.module';
import { UserResponse } from './entities/user-response.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';
import { Exam } from 'src/exam/entities/exam.entity';
import { ExamAccess } from 'src/exam/entities/exam-access.entity';

@Module({
    imports: [
        // ! ===== LOAD JWT MODULE =====
        MyJwtModule,

        // ! ===== LOAD DATABASE MODULE ======
        MariaDbDatabaseModule,

        // ! ===== LOAD USED ENTITY DB =====
        TypeOrmModule.forFeature([Exam, ExamAccess, Question, UserResponse]),
    ],
    controllers: [UserResponseController],
    providers: [UserResponseService],
})
export class UserResponseModule {}
