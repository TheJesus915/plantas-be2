import { Injectable } from '@nestjs/common';
import { User as PrismaUser, UserProfile, SystemRole } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';

type UserWithProfile = PrismaUser & {
    profile?: UserProfile | null;
    user_roles?: {
        role: SystemRole;
    }[];
};

@Injectable()
export class AuthMapper {
    toDomain(prismaUser: UserWithProfile): User {
        const user = new User();
        user.id = prismaUser.id;
        user.type = prismaUser.type;
        user.email = prismaUser.email;
        user.password = prismaUser.password;
        user.status_account = prismaUser.status_account;
        user.name = prismaUser.name ?? undefined;
        user.lastname = prismaUser.lastname ?? undefined;
        user.token_recovery = prismaUser.token_recovery ?? undefined;
        user.token_exp = prismaUser.token_exp ?? undefined;
        user.reset_token = prismaUser.reset_token ?? undefined;
        user.reset_token_exp = prismaUser.reset_token_exp ?? undefined;
        user.registration_date = prismaUser.registration_date ?? undefined;
        user.profile_picture = prismaUser.profile?.profile_picture ?? undefined;
        if (prismaUser.user_roles && prismaUser.user_roles.length > 0) {
            user.rolname = prismaUser.user_roles[0].role.name;
        }

        return user;
    }

    static toPrismaCreate(userData: any) {
        const { profile, ...userInfo } = userData;

        return {
            ...userInfo,
            profile: profile ? {
                create: {
                    birthdate: new Date(profile.birthdate),
                    phone: profile.phone,
                    country: profile.country,
                    province: profile.province,
                    city: profile.city,
                    profile_picture: profile.profile_picture
                }
            } : undefined
        };
    }
}