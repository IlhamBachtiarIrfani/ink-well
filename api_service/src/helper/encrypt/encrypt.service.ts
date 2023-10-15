import { Injectable } from '@nestjs/common';
import { hash, compare, genSalt } from 'bcrypt';
import { MyConfigService } from 'src/config/my-config/my-config.service';

@Injectable()
export class EncryptService {
    constructor(private myConfigService: MyConfigService) {}

    async encryptPassword(password: string): Promise<string> {
        const secret = this.myConfigService.passwordSecret;
        const passwordWithSecret = password + secret;
        const salt = await genSalt(this.myConfigService.saltRounds);
        return hash(passwordWithSecret, salt);
    }

    async comparePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        const secret = this.myConfigService.passwordSecret;
        const plainPasswordWithSecret = plainPassword + secret;
        return compare(plainPasswordWithSecret, hashedPassword);
    }
}
