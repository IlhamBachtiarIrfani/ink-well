import { Module } from '@nestjs/common';
import { ErrorLogService } from './error-log.service';
import { MongoDbDatabaseModule } from 'src/config/database/mongodb-database.module';
import { CommonModule } from '../common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorLog, ErrorLogSchema } from './schema/error-log.schema';
import { MyConfigModule } from 'src/config/my-config/my-config.module';

@Module({
    imports: [
        // MONGO DB MODULE
        MongoDbDatabaseModule,
        CommonModule,
        MyConfigModule,

        // MONGODB SCHEMA CONNECTION
        MongooseModule.forFeature([
            { name: ErrorLog.name, schema: ErrorLogSchema },
        ]),
    ],
    providers: [ErrorLogService],
    exports: [CommonModule, MyConfigModule, ErrorLogService],
})
export class ErrorLogModule {}
