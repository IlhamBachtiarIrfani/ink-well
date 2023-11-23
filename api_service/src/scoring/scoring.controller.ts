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

export interface MessageEvent {
    data: string | object;
    id?: string;
    type?: string;
    retry?: number;
}

@Controller('scoring')
@UseInterceptors(ClassSerializerInterceptor)
export class ScoringController implements OnModuleInit {
    constructor(private readonly scoringService: ScoringService) {}
    private eventSubject: Subject<any> = new Subject();

    async onModuleInit() {
        const redis = new Redis({ host: 'localhost', port: 6379 });
        await redis.subscribe('ml-progress');

        redis.on('message', (channel, message) => {
            const jsonData = JSON.parse(message);
            this.eventSubject.next(jsonData);
        });
    }

    @Sse('progress/:exam_id')
    sse(@Param('exam_id') exam_id: string): Observable<MessageEvent> {
        return this.eventSubject.asObservable().pipe(
            map((data) => {
                if (data.id == exam_id) {
                    return data;
                }
            }),
        );
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

    @Get(':id/user/:userId')
    @Roles(AccessRole.ADMIN)
    @UseGuards(TokenAuthGuard)
    getUserScore(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @Request() req,
    ) {
        const userTokenData: UserTokenData = req.user;
        return this.scoringService.userScore(userTokenData, id, userId);
    }
}
