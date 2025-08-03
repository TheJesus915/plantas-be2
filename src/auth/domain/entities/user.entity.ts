import { Role, StatusAccount } from '@prisma/client';
export { StatusAccount } from '@prisma/client';
export class User {
    id: string;
    email: string;
    password: string;
    type: Role;
    status_account: StatusAccount;
    profile_picture?: string | null;
    rolname?: string | null;
    name?: string;
    lastname?: string;
    token_recovery?: string;
    token_exp?: Date;
    reset_token?: string;
    reset_token_exp?: Date;
    registration_date?: Date;
}
