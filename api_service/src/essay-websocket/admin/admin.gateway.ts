import {
    OnGatewayConnection,
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    WsException,
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
import { Exam, ExamState } from 'src/exam/entities/exam.entity';
import { SchedulerRegistry } from '@nestjs/schedule';

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
        private schedulerRegistry: SchedulerRegistry,
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
                ExamAccessType.ADMIN,
                client.id,
            );

            if (examData.exam.state === ExamState.ACTIVE) {
                client.emit('events', { type: 'WAITING', data: null });
            } else if (examData.exam.state === ExamState.STARTED) {
                const data = await this.essayWebsocketService.getExamData(
                    quiz_id,
                );
                client.emit('events', { type: 'STARTED', data: data });
            }
        } catch (error) {
            client.emit('exception', 'INVALID_QUIZ_ID');
            return client.disconnect();
        }

        client.join(roomPrefix + quiz_id);
        console.log('Admin Joined : ' + client.id);
        this.updateParticipantEvent(quiz_id);

        client.on('disconnecting', () => {
            this.essayWebsocketService.leaveQuizId(quiz_id, payload.user_id);
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

    @SubscribeMessage('startExam')
    async startExam(client: Socket) {
        console.log('STARTING EXAM');
        try {
            // Get user token data
            const userToken: UserTokenData = client['user'];
            const quiz_id: string = client['quiz_id'];

            const quizData = await this.adminService.startQuiz(
                userToken,
                quiz_id,
            );
            const data = await this.essayWebsocketService.getExamData(quiz_id);
            this.server
                .to(roomPrefix + quiz_id)
                .emit('events', { type: 'STARTED', data: data });
            this.participantGateway.onQuizTriggerStart(quiz_id);

            const timeout = setTimeout(
                () => this.finishExam(quizData, userToken),
                quizData.duration_in_minutes * 60 * 1000,
            );
            this.schedulerRegistry.addTimeout(
                `finish-quiz-${quizData.id}`,
                timeout,
            );
        } catch (error) {
            throw new WsException(error);
        }
    }

    private async finishExam(examData: Exam, UserToken: UserTokenData) {
        console.log('finish-quiz-' + examData.id);

        await this.adminService.finishQuiz(UserToken, examData.id);

        this.server
            .to(roomPrefix + examData.id)
            .emit('events', { type: 'FINISHED', data: null });

        this.participantGateway.onQuizTriggerStop(examData.id);
    }
}
