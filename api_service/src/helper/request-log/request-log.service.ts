import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestLog, RequestLogDocument } from './schema/request-log.schema';

@Injectable()
export class RequestLogService {
    constructor(
        @InjectModel(RequestLog.name)
        private requestModel: Model<RequestLogDocument>,
    ) {}

    // ! REQUEST LOG FILE PATH
    private readonly requestLogFilePath = '/logs/request.log';

    // ! ===== LOG REQUEST =====
    async logRequest(
        method: string,
        path: string,
        query: any,
        user: any,
        ip: string,
        response: any,
        latencyMs: number | null,
    ) {
        console.log(`${latencyMs}ms [${method}] ${path}`);

        // GET CURRENT DATE
        const dateNow = new Date().toISOString();

        try {
            // CREATE REGISTER LOG DATA
            const createdLog = new this.requestModel({
                createdAt: dateNow,
                method,
                path,
                query,
                user,
                response,
                ip,
                latencyMs,
            });

            // SAVE TO MONGODB
            await createdLog.save();
        } catch (error) {
            // ! SAVE TO LOCAL FILE
            const data = JSON.stringify({
                method,
                path,
                query,
                user,
                response,
                ip,
                latencyMs,
            });
            fs.appendFileSync(
                this.requestLogFilePath,
                `${dateNow}: [${method}] ${path} => ${data}\n`,
            );
            console.log('Request Log Saved in File');
        }
    }
}
