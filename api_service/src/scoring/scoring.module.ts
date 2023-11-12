import { Module } from '@nestjs/common';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';
import { MessageBrokerModule } from 'src/message_broker/message_broker.module';
import { MariaDbDatabaseModule } from 'src/config/database/mariadb-database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/exam/entities/exam.entity';
import { ExamScore } from './entities/exam_score.entity';

@Module({
    imports: [
        // ! ===== LOAD DATABASE MODULE ======
        MariaDbDatabaseModule,

        // ! ===== LOAD USED ENTITY DB =====
        TypeOrmModule.forFeature([Exam, ExamScore]),

        MessageBrokerModule,
    ],
    controllers: [ScoringController],
    providers: [ScoringService],
    exports: [ScoringService],
})
export class ScoringModule {}
