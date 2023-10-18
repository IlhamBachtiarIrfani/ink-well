import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DataFormatInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((response) => {
                // GET RESPONSE STATUS CODE
                const statusCode = context
                    .switchToHttp()
                    .getResponse().statusCode;

                // GIVE DEFAULT MESSAGE OK
                const message = 'OK';
                const fulfilled = 1;

                // * FORMAT PAGINATION RESPONSE DATA
                if (response?.data && response?.pagination) {
                    return {
                        statusCode,
                        message,
                        fulfilled,
                        data: response.data,
                        pagination: response.pagination,
                    };
                }

                // * FORMAT DEFAULT DATA
                return {
                    statusCode,
                    message,
                    fulfilled,
                    data: response,
                };
            }),
        );
    }
}
