import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { MyConfigService } from '../my-config/my-config.service';
import { MyConfigModule } from '../my-config/my-config.module';
import { UserToken } from 'src/user/entities/user-token.entity';

@Module({
    imports: [
        // ! ===== LOAD TYPEORM MARIA DB MODULE =====
        TypeOrmModule.forRootAsync({
            imports: [MyConfigModule],
            useFactory: async (configService: MyConfigService) => ({
                type: 'mariadb',
                // * define connection based on config
                host: configService.dbHost,
                port: configService.dbPort,
                database: configService.dbName,

                // * define auth based on config
                username: configService.dbUser,
                password: configService.dbPassword,

                // * define entity object db
                entities: [User, UserToken],
                synchronize: true,
            }),
            inject: [MyConfigService],
        }),
    ],
})
export class MariaDbDatabaseModule {}
