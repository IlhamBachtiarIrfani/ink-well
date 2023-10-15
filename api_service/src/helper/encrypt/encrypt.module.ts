import { Module } from '@nestjs/common';
import { EncryptService } from './encrypt.service';
import { MyConfigModule } from 'src/config/my-config/my-config.module';

@Module({
    imports: [MyConfigModule],
    providers: [EncryptService],
    exports: [EncryptService],
})
export class EncryptModule {}
