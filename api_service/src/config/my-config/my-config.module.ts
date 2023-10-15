import { Module } from '@nestjs/common';
import { MyConfigService } from './my-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [MyConfigService],
    exports: [MyConfigService],
})
export class MyConfigModule {}
