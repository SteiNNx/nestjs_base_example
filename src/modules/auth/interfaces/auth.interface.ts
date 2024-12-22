// src/modules/auth/interfaces/auth.interface.ts

export interface IUser {
    username: string;
    password: string;
    userId: number;
    role: string;
    created_at: string;
}
