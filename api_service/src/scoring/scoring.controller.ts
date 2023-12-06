import {
    Controller,
    Sse,
    OnModuleInit,
    Param,
    Get,
    Request,
    ClassSerializerInterceptor,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Observable, Subject, map } from 'rxjs';
import { Redis } from 'ioredis';
import { UserTokenData } from 'src/user/entities/user.entity';
import { ScoringService } from './scoring.service';
import { AccessRole } from 'src/user/roles.enum';
import { TokenAuthGuard } from 'src/user/token-auth/token-auth.guard';
import { Roles } from 'src/user/roles.decorator';
import { MyConfigService } from 'src/config/my-config/my-config.service';

export interface MessageEvent {
    data: string | object;
    id?: string;
    type?: string;
    retry?: number;
}

@Controller('scoring')
@UseInterceptors(ClassSerializerInterceptor)
export class ScoringController implements OnModuleInit {
    constructor(
        private readonly scoringService: ScoringService,
        private readonly myConfigService: MyConfigService,
    ) {}
    private eventSubject: Subject<any> = new Subject();

    async onModuleInit() {
        const redis = new Redis({
            host: this.myConfigService.redisHost,
            port: this.myConfigService.redisPort,
        });
        await redis.subscribe('ml-progress');

        redis.on('message', (channel, message) => {
            const jsonData = JSON.parse(message);
            this.eventSubject.next(jsonData);

            this.scoringService.insertScoreLog(
                jsonData.id,
                jsonData.data.progress_type,
                jsonData.data.progress_percent,
                jsonData.data.progress_detail,
            );
        });
    }

    @Sse('progress/:exam_id')
    sseProgress(@Param('exam_id') exam_id: string): Observable<MessageEvent> {
        return this.eventSubject.asObservable().pipe(
            map((data) => {
                if (data.id == exam_id) {
                    return data;
                }
            }),
        );
    }

    @Get('progress_all/:exam_id')
    getProgress(@Param('exam_id') id: string) {
        return this.scoringService.getScoreLog(id);
    }

    @Get('process/:id')
    @Roles(AccessRole.ADMIN)
    @UseGuards(TokenAuthGuard)
    process(@Param('id') id: string) {
        return this.scoringService.processScoring(id);
    }

    @Get(':id')
    @Roles(AccessRole.ADMIN)
    @UseGuards(TokenAuthGuard)
    getScore(@Param('id') id: string, @Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.scoringService.examScore(userTokenData, id);
    }

    @Get(':id/question/:questionId')
    @Roles(AccessRole.ADMIN)
    @UseGuards(TokenAuthGuard)
    getQuestionScore(
        @Param('id') id: string,
        @Param('questionId') questionId: string,
        @Request() req,
    ) {
        const userTokenData: UserTokenData = req.user;
        return this.scoringService.questionScore(userTokenData, id, questionId);
    }

    @Get(':id/user')
    @Roles(AccessRole.PARTICIPANT)
    @UseGuards(TokenAuthGuard)
    getUserPersonalScore(@Param('id') id: string, @Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.scoringService.userScore(id, userTokenData.user_id);
    }

    @Get(':id/user/:userId')
    @Roles(AccessRole.ADMIN)
    @UseGuards(TokenAuthGuard)
    getUserScore(@Param('id') id: string, @Param('userId') userId: string) {
        return this.scoringService.userScore(id, userId);
    }
}
