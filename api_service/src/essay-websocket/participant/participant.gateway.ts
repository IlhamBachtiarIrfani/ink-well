import { Inject, UseGuards, forwardRef } from '@nestjs/common';
import {
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { AdminGateway } from '../admin/admin.gateway';
import { Server, Socket } from 'socket.io';
import { AccessRole } from 'src/user/roles.enum';
import { EssayWebsocketGuard } from '../essay-websocket.guard';
import { Roles } from 'src/user/roles.decorator';
import { roomPrefix, validateSocket } from '../utils';
import { MyJwtService } from 'src/config/my-jwt/my-jwt.service';
import { UserTokenData } from 'src/user/entities/user.entity';
import { EssayWebsocketService } from '../essay-websocket.service';
import { ExamAccessType } from 'src/exam/entities/exam-access.entity';
import { ExamState } from 'src/exam/entities/exam.entity';

@WebSocketGateway({
    namespace: 'participant',
    cors: {
        origin: '*',
    },
})
@UseGuards(EssayWebsocketGuard)
@Roles(AccessRole.PARTICIPANT)
export class ParticipantGateway implements OnGatewayConnection {
    constructor(
        @Inject(forwardRef(() => AdminGateway))
        private adminGateway: AdminGateway,
        private myJwtService: MyJwtService,
        private essayWebsocketService: EssayWebsocketService,
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
            const examData = await this.essayWebsocketService.checkQuizId(
                authQuizId,
                payload.user_id,
                ExamAccessType.PARTICIPANT,
                client.id,
            );

            if (examData.exam.state === ExamState.ACTIVE) {
                client.emit('events', 'WAITING');
            } else if (examData.exam.state === ExamState.STARTED) {
                client.emit('events', 'STARTED');
            }
        } catch (error) {
            client.emit('exception', 'INVALID_QUIZ_ID');
            return client.disconnect();
        }

        client.join(roomPrefix + authQuizId);
        this.adminGateway.onParticipantJoin(authQuizId, client, payload);

        client.on('disconnecting', async () => {
            await this.essayWebsocketService.leaveQuizId(
                authQuizId,
                payload.user_id,
            );
            this.adminGateway.onParticipantLeave(authQuizId, client, payload);
        });
    }
}
