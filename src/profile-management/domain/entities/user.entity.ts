import { UserProfile } from './user-profile.entity';

export type StatusAccount = 'Pending' | 'Active' | 'Inactive';
export type Role = 'superadmin' | 'admin' | 'general';

export class User {
    id: string;
    email: string;
    password: string;
    name: string;
    lastname: string;
    type: Role;
    token_recovery: string | null;
    token_exp: Date | null;
    reset_token: string | null;
    reset_token_exp: Date | null;
    registration_date: Date;
    status_account: StatusAccount;
    profile?: UserProfile | null;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}