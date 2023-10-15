import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserTokenData } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MyConfigService } from '../my-config/my-config.service';
import { addSeconds } from 'date-fns';

@Injectable()
export class MyJwtService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly myConfigService: MyConfigService,
    ) {}

    async generateJwt(user: User) {
        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        const payload: UserTokenData = {
            user_id: user.id,
            user_email: user.email,
            user_name: user.name,
            user_role: user.role,
        };

        const access_token = await this.jwtService.signAsync(payload);

        const expirationTimeInSeconds = await this.myConfigService.jwtExpired;

        const currentDate = new Date();
        const expiresDate = addSeconds(currentDate, expirationTimeInSeconds);

        return {
            access_token: access_token,
            expiresIn: expiresDate,
            user: {
                role: user.role,
                name: user.name,
                email: user.email,
            },
        };
    }

    async verifyAsync(token) {
        return this.jwtService.verifyAsync(token, {
            secret: this.myConfigService.jwtSecret,
        });
    }
}
