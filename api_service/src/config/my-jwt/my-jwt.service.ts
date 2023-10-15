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
    async generateJwt(user: User) {
        // check if user no empty
        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        // set payload data
        const payload: UserTokenData = {
            user_id: user.id,
            user_email: user.email,
            user_name: user.name,
            user_role: user.role,
        };

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
