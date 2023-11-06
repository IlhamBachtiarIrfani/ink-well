import { Socket } from 'socket.io';

export const roomPrefix = 'QUIZ-ROOM-';

export function extractTokenFromHeader(socket: Socket): string | undefined {
    const [type, token] =
        socket.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
}

export function extractQuizIdFromHeader(socket: Socket): string | undefined {
    const quiz_id = socket.handshake.headers.quiz_id;
    return quiz_id.toString() ?? undefined;
}

export function validateSocket(client: Socket) {
    const authHeader = extractTokenFromHeader(client);
    if (!authHeader) {
        client.emit('exception', 'TOKEN_REQUIRED');
        client.disconnect();
    }

    const authQuizId = extractQuizIdFromHeader(client);
    if (!authQuizId) {
        client.emit('exception', 'QUIZ_ID_REQUIRED');
        client.disconnect();
    }

    return { authHeader, authQuizId };
}
