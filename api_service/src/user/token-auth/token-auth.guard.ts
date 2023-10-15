import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MyJwtService } from 'src/config/my-jwt/my-jwt.service';
import { AccessRole } from '../roles.enum';
import { ROLES_KEY } from '../roles.decorator';
import { UserTokenData } from '../entities/user.entity';
import { Request } from 'express';

@Injectable()
export class TokenAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private myJwtService: MyJwtService,
    ) {}

    async canActivate(context: ExecutionContext) {
        let requiredRoles = this.reflector.getAllAndOverride<AccessRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            requiredRoles = [AccessRole.PUBLIC];
        }

        if (requiredRoles.includes(AccessRole.PUBLIC)) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('TOKEN_REQUIRED');
        }

        try {
            const payload: UserTokenData = await this.myJwtService.verifyAsync(
                token,
            );

            request['user'] = payload;

            return requiredRoles.some((role) => payload.user_role == role);
        } catch {
            throw new UnauthorizedException('Invalid Token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
