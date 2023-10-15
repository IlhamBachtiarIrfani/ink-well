import { Module } from '@nestjs/common';
import { MyConfigService } from './my-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    // ! ===== LOAD NEST JS CONFIG MODULE =====
    imports: [ConfigModule.forRoot()],
    providers: [MyConfigService],
    exports: [MyConfigService],
})
export class MyConfigModule {}
