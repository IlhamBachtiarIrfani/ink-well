import { Module } from '@nestjs/common';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';
import { MessageBrokerModule } from 'src/message_broker/message_broker.module';
import { MariaDbDatabaseModule } from 'src/config/database/mariadb-database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/exam/entities/exam.entity';
import { ExamScore } from './entities/exam_score.entity';
import { Question } from 'src/question/entities/question.entity';
import { MyJwtModule } from 'src/config/my-jwt/my-jwt.module';
import { ExamAccess } from 'src/exam/entities/exam-access.entity';

@Module({
    imports: [
        // ! ===== LOAD JWT MODULE =====
        MyJwtModule,

        // ! ===== LOAD DATABASE MODULE ======
        MariaDbDatabaseModule,

        // ! ===== LOAD USED ENTITY DB =====
        TypeOrmModule.forFeature([Exam, ExamAccess, ExamScore, Question]),

        MessageBrokerModule,
    ],
    controllers: [ScoringController],
    providers: [ScoringService],
    exports: [ScoringService],
})
export class ScoringModule {}
