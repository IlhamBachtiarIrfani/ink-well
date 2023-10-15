import { Module } from '@nestjs/common';
import { MongoDbDatabaseModule } from 'src/config/database/mongodb-database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLog, RequestLogSchema } from './schema/request-log.schema';
import { RequestLogService } from './request-log.service';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        // MONGO DB MODULE
        MongoDbDatabaseModule,
        CommonModule,

        // MONGODB SCHEMA CONNECTION
        MongooseModule.forFeature([
            { name: RequestLog.name, schema: RequestLogSchema },
        ]),
    ],
    providers: [RequestLogService],
    exports: [CommonModule, RequestLogService],
})
export class RequestLogModule {}
