import { Module } from '@nestjs/common';
import { MyJwtService } from './my-jwt.service';
import { MyConfigModule } from '../my-config/my-config.module';
import { JwtModule } from '@nestjs/jwt';
import { MyConfigService } from '../my-config/my-config.service';

@Module({
    imports: [
        MyConfigModule,
        JwtModule.registerAsync({
            imports: [MyConfigModule],
            useFactory: async (configService: MyConfigService) => ({
                secret: configService.jwtSecret,
            }),
            inject: [MyConfigService],
        }),
    ],
    providers: [MyJwtService],
    exports: [MyJwtService],
})
export class MyJwtModule {}
