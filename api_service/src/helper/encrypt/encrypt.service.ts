import { Injectable } from '@nestjs/common';
import { hash, compare, genSalt } from 'bcrypt';
import { MyConfigService } from 'src/config/my-config/my-config.service';

@Injectable()
export class EncryptService {
    constructor(private myConfigService: MyConfigService) {}

    // ! ===== HASH PASSWORD =====
    async hashPassword(password: string): Promise<string> {
        // get password secret
        const secret = this.myConfigService.passwordSecret;

        // add secret as prefix and postfix
        const passwordWithSecret = secret + password + secret;

        // generate random salt
        const salt = await genSalt(this.myConfigService.saltRounds);

        // return hashes password
        return hash(passwordWithSecret, salt);
    }

    async comparePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        // get password secret
        const secret = this.myConfigService.passwordSecret;

        // add secret as prefix and postfix
        const plainPasswordWithSecret = secret + plainPassword + secret;

        // return comparison hashed password
        return compare(plainPasswordWithSecret, hashedPassword);
    }
}
