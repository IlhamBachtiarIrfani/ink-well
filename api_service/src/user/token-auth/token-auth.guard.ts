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
        // * get required roles by decorator
        let requiredRoles = this.reflector.getAllAndOverride<AccessRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // if there is no required roles at default value to public
        if (!requiredRoles) {
            requiredRoles = [AccessRole.PUBLIC];
        }

        // if required roles is public don't check the token
        if (requiredRoles.includes(AccessRole.PUBLIC)) {
            return true;
        }

        // get request data
        const request = context.switchToHttp().getRequest();

        // extract token data from request header
        const token = this.extractTokenFromHeader(request);

        // check if there is no token
        if (!token) {
            throw new UnauthorizedException('TOKEN_REQUIRED');
        }

        try {
            // verify token data and get user payload
            const payload: UserTokenData = await this.myJwtService.verifyAsync(
                token,
            );

            // add user data to request
            request['user'] = payload;

            // return access
            return requiredRoles.some((role) => payload.user_role == role);
        } catch {
            // return invalid token when catch error when verify token
            throw new UnauthorizedException('Invalid Token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
