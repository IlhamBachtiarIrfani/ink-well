import {
    OnGatewayConnection,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { ParticipantGateway } from '../participant/participant.gateway';
import { Inject, UseGuards, forwardRef } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Roles } from 'src/user/roles.decorator';
import { AccessRole } from 'src/user/roles.enum';
import { EssayWebsocketGuard } from '../essay-websocket.guard';
import { roomPrefix, validateSocket } from '../utils';
import { UserTokenData } from 'src/user/entities/user.entity';
import { MyJwtService } from 'src/config/my-jwt/my-jwt.service';
import { EssayWebsocketService } from '../essay-websocket.service';
import { ExamAccessType } from 'src/exam/entities/exam-access.entity';
import { AdminService } from './admin.service';

@WebSocketGateway({
    namespace: 'admin',
    cors: {
        origin: '*',
    },
})
@UseGuards(EssayWebsocketGuard)
@Roles(AccessRole.ADMIN)
export class AdminGateway implements OnGatewayConnection {
    constructor(
        @Inject(forwardRef(() => ParticipantGateway))
        private participantGateway: ParticipantGateway,
        private myJwtService: MyJwtService,
        private essayWebsocketService: EssayWebsocketService,
        private adminService: AdminService,
    ) {}

    @WebSocketServer() public server: Server;

    async handleConnection(client: Socket) {
        const { authHeader, authQuizId } = validateSocket(client);
        let payload: UserTokenData;

        try {
            payload = await this.myJwtService.verifyAsync(authHeader);
        } catch (error) {
            client.emit('exception', 'INVALID_TOKEN');
            return client.disconnect();
        }

        try {
            await this.essayWebsocketService.checkQuizId(
                authQuizId,
                payload.user_id,
                ExamAccessType.ADMIN,
                client.id,
            );
        } catch (error) {
            client.emit('exception', 'INVALID_QUIZ_ID');
            return client.disconnect();
        }

        client.join(roomPrefix + authQuizId);
        console.log('Admin Joined : ' + client.id);
        this.updateParticipantEvent(authQuizId);

        client.on('disconnecting', () => {
            this.essayWebsocketService.leaveQuizId(authQuizId, payload.user_id);
        });
    }

    onParticipantJoin(quiz_id: string, client: Socket, payload: UserTokenData) {
        console.log(`Participant Joined : ${payload.user_name} (${client.id})`);

        this.updateParticipantEvent(quiz_id);
    }

    onParticipantLeave(
        quiz_id: string,
        client: Socket,
        payload: UserTokenData,
    ) {
        console.log(`Participant Leaved : ${payload.user_name} (${client.id})`);

        this.updateParticipantEvent(quiz_id);
    }

    private async updateParticipantEvent(quiz_id: string) {
        const data = await this.adminService.getCurrentAccess(quiz_id);
        this.server.to(roomPrefix + quiz_id).emit('participant', data);
    }
}
