import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorLog, ErrorLogDocument } from './schema/error-log.schema';

@Injectable()
export class ErrorLogService {
    constructor(
        @InjectModel(ErrorLog.name)
        private errorLogModel: Model<ErrorLogDocument>,
    ) {}

    // ! ERROR LOG FILE PATH
    private readonly errorLogFilePath = '/logs/error.log';

    // ! ===== LOG ERROR =====
    async logError(
        method: string,
        path: string,
        query: any,
        user: any,
        ip: string,
        status: number,
        statusText: string,
        message: string,
    ) {
        // CONSOLE LOG ERROR
        console.error(`Error [${status}]: ${statusText}`);

        // GET CURRENT DATE
        const dateNow = new Date();

        try {
            // CREATE ERROR LOG DATA
            const createdLog = new this.errorLogModel({
                createdAt: dateNow,
                method,
                path,
                query,
                user,
                ip,
                status,
                statusText,
                message,
            });

            // SAVE TO MONGO DB
            await createdLog.save();
            console.log('Error Log Saved in MongoDB');
        } catch (error) {
            // ! SAVE TO LOCAL FILE
            fs.appendFileSync(
                this.errorLogFilePath,
                `${dateNow}: [${method}] ${path} => ${message}\n`,
            );
            console.log('Error Log Saved in File');
        }
    }
}
