import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { RequestLogService } from './request-log.service';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
    constructor(
        private readonly requestLogService: RequestLogService,
        private commonService: CommonService,
    ) {}

    // ! ===== ON REQUEST PROCESSED =====
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // PARSE REQUEST DATA
        const request = context.switchToHttp().getRequest();

        // GET PATH WITHOUT QUERY
        const path = request.url.split('?')[0];

        // GET METHOD, QUERY, IP
        const { method, query, ip } = request;

        // GET REQ TOKEN HEADER
        const user = request['user'];

        // GET DATE NOW
        const now = Date.now();

        return next.handle().pipe(
            tap(async (response) => {
                // GET LATENCY TIME SPEND
                const timeSpendMs = Date.now() - now;

                // CHECK IF HAVE VALID JSON RESPONSE
                const isJson = await this.commonService.isJSON(response);

                // SAVE LOG DATA
                this.requestLogService.logRequest(
                    method,
                    path,
                    query,
                    user,
                    ip,
                    isJson ? response : 'not-json-response',
                    timeSpendMs,
                );

                // RETURN RESPONSE
                return response;
            }),
        );
    }
}
