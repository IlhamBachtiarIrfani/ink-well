import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { MyJwtService } from 'src/config/my-jwt/my-jwt.service';
import { UserTokenData } from 'src/user/entities/user.entity';
import { ROLES_KEY } from 'src/user/roles.decorator';
import { AccessRole } from 'src/user/roles.enum';
import { extractQuizIdFromHeader, extractTokenFromHeader } from './utils';

@Injectable()
export class EssayWebsocketGuard implements CanActivate {
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

        const socket = context.switchToWs().getClient();
        const token = extractTokenFromHeader(socket);
        const quiz_id = extractQuizIdFromHeader(socket);

        // check if there is no token
        if (!token) {
            throw new WsException('TOKEN_REQUIRED');
        }

        try {
            // verify token data and get user payload
            const payload: UserTokenData = await this.myJwtService.verifyAsync(
                token,
            );

            // add user data to request
            socket['user'] = payload;
            socket['quiz_id'] = quiz_id;

            // return access
            return requiredRoles.some((role) => payload.user_role == role);
        } catch {
            // return invalid token when catch error when verify token
            throw new WsException('Invalid Token');
        }
    }
}
