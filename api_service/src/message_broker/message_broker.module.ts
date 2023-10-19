import { Module } from '@nestjs/common';
import { MessageBrokerService } from './message_broker.service';
import { MyConfigModule } from 'src/config/my-config/my-config.module';

@Module({
    imports: [MyConfigModule],
    providers: [MessageBrokerService],
    exports: [MessageBrokerService],
})
export class MessageBrokerModule {}
