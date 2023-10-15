import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { MyConfigService } from '../my-config/my-config.service';
import { MyConfigModule } from '../my-config/my-config.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [MyConfigModule],
            useFactory: async (configService: MyConfigService) => ({
                type: 'mariadb',
                host: configService.dbHost,
                port: configService.dbPort,
                username: configService.dbUser,
                password: configService.dbPassword,
                database: configService.dbName,
                entities: [User],
                synchronize: true,
            }),
            inject: [MyConfigService],
        }),
    ],
})
export class DatabaseModule {}
