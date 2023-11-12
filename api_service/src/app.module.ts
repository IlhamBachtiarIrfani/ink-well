import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RequestLogModule } from './helper/request-log/request-log.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLogInterceptor } from './helper/request-log/request-log.interceptor';
import { ErrorLogModule } from './helper/error-log/error-log.module';
import { ErrorLogFilter } from './helper/error-log/error-log.filter';
import { DataFormatInterceptor } from './data-format/data-format.interceptor';
import { ExamModule } from './exam/exam.module';
import { QuestionModule } from './question/question.module';
import { UserResponseModule } from './user-response/user-response.module';
import { EssayWebsocketModule } from './essay-websocket/essay-websocket.module';
import { ScoringModule } from './scoring/scoring.module';

@Module({
    imports: [
        ErrorLogModule,
        RequestLogModule,
        UserModule,
        ExamModule,
        QuestionModule,
        UserResponseModule,
        EssayWebsocketModule,
        ScoringModule,
    ],
    controllers: [AppController],
    providers: [
        // DATA FORMAT
        {
            provide: APP_INTERCEPTOR,
            useClass: DataFormatInterceptor,
        },
        // REQUEST LOG
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestLogInterceptor,
        },

        // ERROR LOG
        {
            provide: APP_FILTER,
            useClass: ErrorLogFilter,
        },

        AppService,
    ],
})
export class AppModule {}
