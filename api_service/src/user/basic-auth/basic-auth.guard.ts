import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserTokenData } from '../entities/user.entity';
import { EncryptService } from 'src/helper/encrypt/encrypt.service';
import { Request } from 'express';

@Injectable()
export class BasicAuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private encryptService: EncryptService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // get request data
        const request = context.switchToHttp().getRequest();

        // get header basic auth raw data
        const b64auth = this.extractBasicAuthFromHeader(request);

        if (!b64auth) {
            throw new UnauthorizedException('AUTH_IS_REQUIRED');
        }

        // convert base64 raw data to email and password data
        const [email, password] = Buffer.from(b64auth, 'base64')
            .toString()
            .split(':');

        // find user data by email
        const user = await this.userRepository.findOne({
            where: { email },
        });

        // check if user not found
        if (!user) {
            throw new UnauthorizedException('USER_NOT_FOUND');
        }

        // check the user password
        const isPasswordMatch = await this.encryptService.comparePassword(
            password,
            user.password,
        );

        // check if the password not match
        if (!isPasswordMatch) {
            throw new UnauthorizedException('INVALID AUTH');
        }

        const payload: UserTokenData = {
            user_id: user.id,
            user_email: user.email,
            user_name: user.name,
            user_role: user.role,
        };

        request.user = payload;

        return true;
    }

    private extractBasicAuthFromHeader(request: Request): string | undefined {
        const [type, b64auth] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Basic' ? b64auth : undefined;
    }
}
