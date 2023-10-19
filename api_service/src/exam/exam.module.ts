import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { MyJwtModule } from 'src/config/my-jwt/my-jwt.module';
import { MariaDbDatabaseModule } from 'src/config/database/mariadb-database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { ExamAccess } from './entities/exam-access.entity';
import { MessageBrokerModule } from 'src/message_broker/message_broker.module';

@Module({
    imports: [
        // ! ===== LOAD JWT MODULE =====
        MyJwtModule,

        // ! ===== LOAD DATABASE MODULE ======
        MariaDbDatabaseModule,

        // ! ===== LOAD USED ENTITY DB =====
        TypeOrmModule.forFeature([Exam, ExamAccess]),

        MessageBrokerModule,
    ],
    controllers: [ExamController],
    providers: [ExamService],
})
export class ExamModule {}
