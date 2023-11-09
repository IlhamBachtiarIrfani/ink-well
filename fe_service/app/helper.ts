export function clampNumber(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
}

export enum QuizClientState {
    LOADING = 'LOADING',
    WAITING = 'WAITING',
    STARTED = 'STARTED',
    FINISHED = 'FINISHED',
    ERROR = 'ERROR'
}