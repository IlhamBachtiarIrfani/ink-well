import { Controller, Sse, OnModuleInit, Param } from '@nestjs/common';
import { Observable, Subject, interval, map } from 'rxjs';
import { Redis } from 'ioredis';

export interface MessageEvent {
    data: string | object;
    id?: string;
    type?: string;
    retry?: number;
}

@Controller('scoring')
export class ScoringController implements OnModuleInit {
    private eventSubject: Subject<any> = new Subject();

    async onModuleInit() {
        const redis = new Redis();
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
}
