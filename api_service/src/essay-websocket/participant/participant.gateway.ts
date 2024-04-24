import { Inject, UseGuards, forwardRef } from '@nestjs/common';
import {
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
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
import { ParticipantService } from './participant.service';
import { IsNotEmpty, IsString, validateOrReject } from 'class-validator';
import { ExamUserActionEnum } from 'src/exam/entities/exam-user-action';

class SendResponseProps {
    @IsString()
    @IsNotEmpty()
    question_id: string;

    @IsString()
    @IsNotEmpty()
    response: string;
}

class SendActionProps {
    @IsString()
    @IsNotEmpty()
    action: string;

    detail: any;
}

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
        private participantService: ParticipantService,
    ) {}

    @WebSocketServer() public server: Server;

    async handleConnection(client: Socket) {
        const { token, quiz_id } = validateSocket(client);
        let payload: UserTokenData;

        try {
            payload = await this.myJwtService.verifyAsync(token);
        } catch (error) {
            client.emit('exception', 'INVALID_TOKEN');
            return client.disconnect();
        }

        try {
            const examData = await this.essayWebsocketService.checkQuizId(
                quiz_id,
                payload.user_id,
                ExamAccessType.PARTICIPANT,
                client.id,
            );

            if (examData.exam.state === ExamState.ACTIVE) {
                client.emit('events', { type: 'WAITING', data: null });
            } else if (examData.exam.state === ExamState.STARTED) {
                const questionData =
                    await this.participantService.getAllQuestion(
                        quiz_id,
                        payload.user_id,
                    );
                const data = await this.essayWebsocketService.getExamData(
                    quiz_id,
                );
                client.emit('question', questionData);
                client.emit('events', { type: 'STARTED', data: data });
            }
        } catch (error) {
            console.error(error);
            client.emit('exception', 'INVALID_QUIZ_ID');
            return client.disconnect();
        }

        client.join(roomPrefix + quiz_id);
        this.adminGateway.onParticipantJoin(quiz_id, client, payload);
        await this.participantService.sendAction(
            payload.user_id,
            quiz_id,
            ExamUserActionEnum.JOINED,
            null,
        );

        client.on('disconnecting', async () => {
            await this.essayWebsocketService.leaveQuizId(
                quiz_id,
                payload.user_id,
            );
            await this.participantService.sendAction(
                payload.user_id,
                quiz_id,
                ExamUserActionEnum.LEAVED,
                null,
            );
            this.adminGateway.onParticipantLeave(quiz_id, client, payload);
        });
    }

    async onQuizTriggerStart(quiz_id: string) {
        const questionData = await this.participantService.getAllQuestionGuest(
            quiz_id,
        );
        const data = await this.essayWebsocketService.getExamData(quiz_id);
        this.server.to(roomPrefix + quiz_id).emit('question', questionData);
        this.server
            .to(roomPrefix + quiz_id)
            .emit('events', { type: 'STARTED', data: data });
    }

    async onQuizTriggerStop(quiz_id: string) {
        this.server
            .to(roomPrefix + quiz_id)
            .emit('events', { type: 'FINISHED', data: null });
    }

    @SubscribeMessage('sendResponse')
    async sendResponse(client: Socket, data: any) {
        try {
            // Get user token data
            const userToken: UserTokenData = client['user'];

            const responseData = new SendResponseProps();
            responseData.question_id = data.question_id;
            responseData.response = data.response;

            await validateOrReject(responseData);

            return this.participantService.sendResponse(
                responseData.question_id,
                userToken.user_id,
                responseData.response,
            );
        } catch (error) {
            throw new WsException(error);
        }
    }

    @SubscribeMessage('sendAction')
    async sendAction(client: Socket, data: any) {
        try {
            // Get user token data
            const userToken: UserTokenData = client['user'];
            const quiz_id = client['quiz_id'];

            const responseData = new SendActionProps();
            responseData.action = data.action;
            responseData.detail = data.detail;

            await validateOrReject(responseData);

            console.log(
                `User Action ${userToken.user_id} ${responseData.action}`,
            );

            return this.participantService.sendAction(
                userToken.user_id,
                quiz_id,
                responseData.action,
                responseData.detail,
            );
        } catch (error) {
            throw new WsException(error);
        }
    }
}
