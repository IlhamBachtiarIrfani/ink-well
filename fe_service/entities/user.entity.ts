export enum UserRole {
    ADMIN = "ADMIN",
    PARTICIPANT = "PARTICIPANT",
}

export interface UserData {
    token: string,
    name: string,
    email: string,
    role: UserRole,
    photo_url: string
}