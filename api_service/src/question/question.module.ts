import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { MyJwtModule } from 'src/config/my-jwt/my-jwt.module';
import { MariaDbDatabaseModule } from 'src/config/database/mariadb-database.module';
import { Question } from './entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamService } from 'src/exam/exam.service';
import { Exam } from 'src/exam/entities/exam.entity';
import { ExamAccess } from 'src/exam/entities/exam-access.entity';
import { QuestionKeyword } from './entities/question-keyword.entitiy';
import { MessageBrokerModule } from 'src/message_broker/message_broker.module';

@Module({
    imports: [
        // ! ===== LOAD JWT MODULE =====
        MyJwtModule,

        // ! ===== LOAD DATABASE MODULE ======
        MariaDbDatabaseModule,

        // ! ===== LOAD USED ENTITY DB =====
        TypeOrmModule.forFeature([Exam, ExamAccess, Question, QuestionKeyword]),

        MessageBrokerModule,
    ],
    controllers: [QuestionController],
    providers: [QuestionService, ExamService],
})
export class QuestionModule {}
