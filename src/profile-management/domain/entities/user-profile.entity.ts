export class UserProfile {
    id: string;
    user_id: string;
    profile_picture?: string | null;
    birthdate: Date;
    phone: string;
    country: string;
    province: string;
    city: string;

    constructor(partial: Partial<UserProfile>) {
        Object.assign(this, partial);
    }
}