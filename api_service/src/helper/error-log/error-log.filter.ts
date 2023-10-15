import {
    Catch,
    ArgumentsHost,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorLogService } from './error-log.service';
import { MyConfigService } from 'src/config/my-config/my-config.service';
import { RequestLogService } from '../request-log/request-log.service';

@Catch()
export class ErrorLogFilter implements ExceptionFilter {
    constructor(
        private readonly errorLogService: ErrorLogService,
        private readonly requestLogService: RequestLogService,
        private myConfigService: MyConfigService,
    ) {}

    catch(exception: any, host: ArgumentsHost) {
        // GET RESPONSE REQUEST DATA
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // GET PATH WITHOUT QUERY
        const path = request.url.split('?')[0];

        // GET METHOD, QUERY, IP
        const { method, query, ip } = request;

        // GET USER JWT HEADER
        const user = request['user'];

        // GET EXCEPTION MESSAGE AND STACK
        const { message, stack } = exception;

        // DEFINE DEFAULT ERROR STATUS
        let status = 500;
        let statusText = 'Internal server error';

        // CHECK IF CATCH HTTP EXCEPTION
        if (exception instanceof HttpException) {
            // SET NORMAL HTTP STATUS AND MESSAGE
            status = exception.getStatus();
            statusText = exception.message;
        } else {
            // CONSOLE ERROR IF NOT HTTP EXCEPTION
            console.error(exception);
        }

        // ! GET DEBUG MODE
        const isDebug = this.myConfigService.isDebug;

        // ! SAVE ERROR LOG
        this.errorLogService.logError(
            method,
            path,
            query,
            user,
            ip,
            status,
            statusText,
            message + '\n' + stack,
        );

        // CREATE ERROR RESPONSE
        let errorResponse = {
            message: statusText,
            statusCode: status,
            fulfilled: 0,
        };

        // SET RESPONSE IF EXCEPTION HAVE OWN RESPONSE
        if (exception.response) {
            errorResponse = { ...exception.response, fulfilled: 0 };
        }

        // ! SAVE ACCESS LOG
        this.requestLogService.logRequest(
            method,
            path,
            query,
            user,
            ip,
            { ...errorResponse },
            null,
        );

        // ! IF DEBUG MODE SET RESPONSE WITH DEBUG ERROR
        if (isDebug) {
            errorResponse['debug_errors'] = [
                {
                    message,
                    stack,
                },
            ];
        }

        // RETURN RESPONSE
        return response.status(status).json(errorResponse);
    }
}
