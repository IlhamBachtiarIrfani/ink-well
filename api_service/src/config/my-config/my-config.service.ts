import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class MyConfigService {
    constructor(private nestConfigService: NestConfigService) {}

    get dbHost(): string {
        return this.nestConfigService.get<string>('DB_HOST');
    }

    get dbPort(): number {
        return this.nestConfigService.get<number>('DB_PORT');
    }

    get dbUser(): string {
        return this.nestConfigService.get<string>('DB_USER');
    }

    get dbPassword(): string {
        return this.nestConfigService.get<string>('DB_PASSWORD');
    }

    get dbName(): string {
        return this.nestConfigService.get<string>('DB_NAME');
    }

    get saltRounds(): number {
        return parseInt(this.nestConfigService.get<string>('SALT_ROUNDS'), 10);
    }

    get passwordSecret(): string {
        return this.nestConfigService.get<string>('PASSWORD_SECRET_KEY');
    }

    get jwtSecret(): string {
        return this.nestConfigService.get<string>('JWT_SECRET');
    }

    get jwtExpired(): number {
        return this.nestConfigService.get<number>('JWT_EXPIRED_TIME');
    }
}
