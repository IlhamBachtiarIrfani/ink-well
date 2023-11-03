export enum UserRole {
    ADMIN = "ADMIN",
    PARTICIPANT = "PARTICIPANT",
}

export interface UserData {
    token: string,
    name: string,
    email: string,
    role: UserRole
}

export function clampNumber(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
}