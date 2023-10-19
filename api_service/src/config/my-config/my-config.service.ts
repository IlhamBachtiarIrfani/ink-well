import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class MyConfigService {
    constructor(private nestConfigService: NestConfigService) {}

    // ! ===== GET DEBUG VALUE =====
    get isDebug() {
        return this.nestConfigService.get<number>('IS_DEBUG') == 1;
    }

    // ! ===== GET MARIA DB HOST =====
    get dbHost(): string {
        return this.nestConfigService.get<string>('DB_HOST');
    }

    // ! ===== GET MARIA DB PORT =====
    get dbPort(): number {
        return this.nestConfigService.get<number>('DB_PORT');
    }

    // ! ===== GET MARIA DB USER =====
    get dbUser(): string {
        return this.nestConfigService.get<string>('DB_USER');
    }

    // ! ===== GET MARIA DB PASSWORD =====
    get dbPassword(): string {
        return this.nestConfigService.get<string>('DB_PASSWORD');
    }

    // ! ===== GET MARIA DB NAME =====
    get dbName(): string {
        return this.nestConfigService.get<string>('DB_NAME');
    }

    // ! ===== GET MONGO DB URI =====
    get mongoUri(): string {
        const host = this.mongoHost;
        const port = this.mongoPort;

        return `mongodb://${host}:${port}`;
    }

    // ! ===== GET MONGO DB HOST =====
    get mongoHost(): string {
        return this.nestConfigService.get<string>('MONGO_HOST');
    }

    // ! ===== GET MONGO DB PORT =====
    get mongoPort(): number {
        return this.nestConfigService.get<number>('MONGO_PORT');
    }

    // ! ===== GET MONGO DB USER =====
    get mongoUser(): string {
        return this.nestConfigService.get<string>('MONGO_USER');
    }

    // ! ===== GET MONGO DB PASSWORD =====
    get mongoPassword(): string {
        return this.nestConfigService.get<string>('MONGO_PASSWORD');
    }

    // ! ===== GET MONGO DB NAME =====
    get mongoDbName(): string {
        return this.nestConfigService.get<string>('MONGO_DB_NAME');
    }

    // ! ===== GET PASSWORD HASH SALT ROUNDS =====
    get saltRounds(): number {
        return parseInt(this.nestConfigService.get<string>('SALT_ROUNDS'), 10);
    }

    // ! ===== GET PASSWORD HASH SECRET =====
    get passwordSecret(): string {
        return this.nestConfigService.get<string>('PASSWORD_SECRET_KEY');
    }

    // ! ===== GET JWT SECRET =====
    get jwtSecret(): string {
        return this.nestConfigService.get<string>('JWT_SECRET');
    }

    // ! ===== GET JWT EXPIRED TIME =====
    get jwtExpired(): number {
        return this.nestConfigService.get<number>('JWT_EXPIRED_TIME');
    }

    // ! ===== GET RABBITMQ HOURLST =====
    get rabbitMqUrl(): string {
        const user = this.rabbitMqUser;
        const password = this.rabbitMqPassword;
        const host = this.rabbitMqHost;
        const port = this.rabbitMqPort;
        const url = `amqp://${user}:${password}@${host}:${port}/`;

        console.log('Rabbit MQ URL : ', url);

        return url;
    }

    // ! ===== GET RABBITMQ HOST =====
    get rabbitMqHost(): string {
        return this.nestConfigService.get<string>('RABBITMQ_HOST');
    }

    // ! ===== GET RABBITMQ_PORT =====
    get rabbitMqPort(): number {
        return this.nestConfigService.get<number>('RABBITMQ_PORT');
    }

    // ! ===== GET RABBITMQ USER =====
    get rabbitMqUser(): string {
        return this.nestConfigService.get<string>('RABBITMQ_USER');
    }

    // ! ===== GET RABBITMQ PASSWORD =====
    get rabbitMqPassword(): string {
        return this.nestConfigService.get<string>('RABBITMQ_PASSWORD');
    }

    // ! ===== GET RABBITMQ QUEUE =====
    get rabbitMqQueue(): string {
        return this.nestConfigService.get<string>('RABBITMQ_QUEUE');
    }
}
