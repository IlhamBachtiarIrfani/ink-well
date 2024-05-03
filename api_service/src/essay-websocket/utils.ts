import { Socket } from 'socket.io';

export const roomPrefix = 'QUIZ-ROOM-';

export function extractTokenFromQuery(socket: Socket): string | undefined {
    const token = socket.handshake.query.token;
    return token.toString() ?? undefined;
}

export function extractQuizIdFromQuery(socket: Socket): string | undefined {
    const quiz_id = socket.handshake.query.quiz_id as string;

    return quiz_id.toString() ?? undefined;
}

export function validateSocket(client: Socket) {
    const token = extractTokenFromQuery(client);
    if (!token) {
        client.emit('exception', 'TOKEN_REQUIRED');
        client.disconnect();
    }

    const quiz_id = extractQuizIdFromQuery(client);
    if (!quiz_id) {
        client.emit('exception', 'QUIZ_ID_REQUIRED');
        client.disconnect();
    }

    return { token, quiz_id };
}
