import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { MyConfigService } from '../my-config/my-config.service';
import { MyConfigModule } from '../my-config/my-config.module';
import { UserToken } from 'src/user/entities/user-token.entity';
import { Exam } from 'src/exam/entities/exam.entity';
import { ExamAccess } from 'src/exam/entities/exam-access.entity';
import { Question } from 'src/question/entities/question.entity';
import { QuestionKeyword } from 'src/question/entities/question-keyword';
import { UserResponse } from 'src/user-response/entities/user-response.entity';
import { UserResponseHistory } from 'src/user-response/entities/user-response-history.entity';

@Module({
    imports: [
        // ! ===== LOAD TYPEORM MARIA DB MODULE =====
        TypeOrmModule.forRootAsync({
            imports: [MyConfigModule],
            useFactory: async (configService: MyConfigService) => ({
                type: 'mariadb',
                // * define connection based on config
                host: configService.dbHost,
                port: configService.dbPort,
                database: configService.dbName,

                // * define auth based on config
                username: configService.dbUser,
                password: configService.dbPassword,

                // * define entity object db
                entities: [
                    User,
                    UserToken,
                    Exam,
                    ExamAccess,
                    Question,
                    QuestionKeyword,
                    UserResponse,
                    UserResponseHistory,
                ],
                synchronize: true,
            }),
            inject: [MyConfigService],
        }),
    ],
})
export class MariaDbDatabaseModule {}
