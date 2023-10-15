import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { EncryptService } from 'src/helper/encrypt/encrypt.service';

@Injectable()
export class BasicAuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private encryptService: EncryptService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const b64auth =
            (request.headers.authorization || '').split(' ')[1] || '';
        const [email, password] = Buffer.from(b64auth, 'base64')
            .toString()
            .split(':');

        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (
            user &&
            (await this.encryptService.comparePassword(
                password,
                user.password,
            )) !== false
        ) {
            request.user = user;
            return true;
        }

        throw new UnauthorizedException('Invalid Auth');
    }
}
