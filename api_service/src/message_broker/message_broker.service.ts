import { Injectable } from '@nestjs/common';
import {
    ClientProxy,
    ClientProxyFactory,
    Transport,
} from '@nestjs/microservices';
import { MyConfigService } from 'src/config/my-config/my-config.service';

@Injectable()
export class MessageBrokerService {
    private client: ClientProxy;

    constructor(private myConfigService: MyConfigService) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [this.myConfigService.rabbitMqUrl],
                queue: this.myConfigService.rabbitMqQueue,
                queueOptions: {
                    durable: false,
                },
            },
        });
    }

    async publishMessage(data: any) {
        return this.client.emit('message_pattern', data);
    }
}
