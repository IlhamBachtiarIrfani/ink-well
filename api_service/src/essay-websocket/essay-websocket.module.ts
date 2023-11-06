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

@Module({
    imports: [
        // ! ===== LOAD JWT MODULE =====
        MyJwtModule,

        // ! ===== LOAD DATABASE MODULE ======
        MariaDbDatabaseModule,

        // ! ===== LOAD USED ENTITY DB =====
        TypeOrmModule.forFeature([Exam, ExamAccess]),
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
