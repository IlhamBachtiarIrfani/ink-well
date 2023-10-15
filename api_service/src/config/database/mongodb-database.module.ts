import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoServerSelectionError } from 'mongodb';
import { MyConfigModule } from '../my-config/my-config.module';
import { MyConfigService } from '../my-config/my-config.service';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [MyConfigModule],
            useFactory: async (configService: MyConfigService) => ({
                // ! SET MONGODB CONNECTION
                uri: configService.mongoUri,
                dbName: configService.mongoDbName,

                // ! SET MONGODB AUTH
                auth: {
                    username: configService.mongoUser,
                    password: configService.mongoPassword,
                },

                // SET DEFAULT ADDITIONAL CONFIG
                bufferCommands: false,
                lazyConnection: true,

                // SET DEFAULT TIMEOUT CONFIG
                socketTimeoutMS: 1000,
                connectTimeoutMS: 1000,
                waitQueueTimeoutMS: 1000,
                serverSelectionTimeoutMS: null,
                heartbeatFrequencyMS: 10000,
                minHeartbeatFrequencyMS: 1000,
                writeConcern: {
                    wtimeoutMS: 1000,
                },
            }),
            inject: [MyConfigService],
        }),
    ],
})
export class MongoDbDatabaseModule {
    constructor() {
        // ! CATCH ANY ERROR OF MONGO DB
        process.on('unhandledRejection', (reason) => {
            if (reason instanceof MongoServerSelectionError) {
                console.log('MongoDB is Offline');
            }
        });
    }
}
