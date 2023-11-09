import { Module } from '@nestjs/common';
import { AdminService } from './admin/admin.service';
import { ParticipantService } from './participant/participant.service';
import { AdminGateway } from './admin/admin.gateway';
import { ParticipantGateway } from './participant/participant.gateway';
import { MyJwtModule } from 'src/config/my-jwt/my-jwt.module';
import { EssayWebsocketService } from './essay-websocket.service';
import { MariaDbDatabaseModule } from 'src/config/database/mariadb-database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/exam/entities/exam.entity';
import { ExamAccess } from 'src/exam/entities/exam-access.entity';
import { Question } from 'src/question/entities/question.entity';
import { UserResponse } from 'src/user-response/entities/user-response.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        // ! ===== LOAD JWT MODULE =====
        MyJwtModule,

        // ! ===== LOAD DATABASE MODULE ======
        MariaDbDatabaseModule,

        // ! ===== LOAD USED ENTITY DB =====
        TypeOrmModule.forFeature([Exam, ExamAccess, Question, UserResponse]),

        ScheduleModule.forRoot(),
    ],
    providers: [
        AdminGateway,
        ParticipantGateway,
        AdminService,
        ParticipantService,
        EssayWebsocketService,
    ],
})
export class EssayWebsocketModule {}
