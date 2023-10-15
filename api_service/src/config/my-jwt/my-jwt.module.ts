import { Module } from '@nestjs/common';
import { MyJwtService } from './my-jwt.service';
import { MyConfigModule } from '../my-config/my-config.module';
import { JwtModule } from '@nestjs/jwt';
import { MyConfigService } from '../my-config/my-config.service';

@Module({
    imports: [
        // ! ===== LOAD MY CONFIG MODULE =====
        MyConfigModule,

        // ! ===== LOAD NEST JS JWT MODULE =====
        JwtModule.registerAsync({
            imports: [MyConfigModule],
            useFactory: async (configService: MyConfigService) => ({
                // * define default jwt config
                secret: configService.jwtSecret,
            }),
            inject: [MyConfigService],
        }),
    ],
    providers: [MyJwtService],
    exports: [MyJwtService],
})
export class MyJwtModule {}
