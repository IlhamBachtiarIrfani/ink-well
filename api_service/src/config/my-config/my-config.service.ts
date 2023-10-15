import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class MyConfigService {
    constructor(private nestConfigService: NestConfigService) {}

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
}
