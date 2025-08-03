import { User, StatusAccount, Role } from '../entities/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface CreateUserData {

    email: string;
    password: string;
    name: string;
    lastname: string;
    type?: Role;
    status_account?: StatusAccount;
    token_recovery?: string | null;
    token_exp?: Date | null;
    reset_token?: string | null;
    reset_token_exp?: Date | null;
    profile?: {
        birthdate: Date;
        phone: string;
        country: string;
        province: string;
        city: string;
        profile_picture?: string | null;
    };
}

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByToken(token: string): Promise<User | null>;
    findByEmailAndToken(email: string, token: string): Promise<User | null>;
    findByResetToken(resetToken: string): Promise<User | null>;
    update(id: string, data: Partial<User>): Promise<User>;
    getProfile(userId: string): Promise<User | null>;
    getProfileAdmin(userId: string): Promise<any>;
}