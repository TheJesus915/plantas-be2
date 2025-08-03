import { Role, StatusAccount } from '@prisma/client';

export interface JwtPayload {
    sub: string;
    name: string;
    type: Role;
    email: string;
    picture?: string | null;
    exp?: number;
}