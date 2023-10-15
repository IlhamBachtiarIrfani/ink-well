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

    // ! ===== GENERATE JWT ACCESS TOKEN BASED ON USER DATA =====
    async generateJwt(payload: UserTokenData) {
        // check if user no empty
        if (!payload) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        // * generate access token
        const access_token = await this.jwtService.signAsync(payload);

        // get jwt expired duration in seconds
        const expirationTimeInSeconds = await this.myConfigService.jwtExpired;

        // * calculate expires date based on duration
        const currentDate = new Date();
        const expiresDate = addSeconds(currentDate, expirationTimeInSeconds);

        // return access token data
        return {
            access_token: access_token,
            expiresIn: expiresDate,
            user: {
                role: payload.user_role,
                name: payload.user_name,
                email: payload.user_email,
            },
        };
    }

    async verifyAsync(token) {
        return this.jwtService.verifyAsync(token, {
            secret: this.myConfigService.jwtSecret,
        });
    }
}
