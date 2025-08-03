import { User } from '../../domain/entities/user.entity';
import { UserProfile } from '../../domain/entities/user-profile.entity';
import { ProfileDto } from '../../application/dtos/User/profile.dto';
import { AdminProfileDto } from '../../application/dtos/User/admin-profile.dto';
export class UserMapper {
    static toDomain(prismaUser: any): User {
        return new User({
            id: prismaUser.id,
            email: prismaUser.email,
            password: prismaUser.password,
            name: prismaUser.name,
            lastname: prismaUser.lastname,
            type: prismaUser.type,
            token_recovery: prismaUser.token_recovery,
            token_exp: prismaUser.token_exp,
            reset_token: prismaUser.reset_token,
            reset_token_exp: prismaUser.reset_token_exp,
            registration_date: prismaUser.registration_date,
            status_account: prismaUser.status_account,
            profile: prismaUser.profile ? this.toProfileDomain(prismaUser.profile) : null
        });
    }

    static toProfileDomain(prismaProfile: any): UserProfile {
        return new UserProfile({
            id: prismaProfile.id,
            user_id: prismaProfile.user_id,
            birthdate: prismaProfile.birthdate,
            phone: prismaProfile.phone,
            country: prismaProfile.country,
            province: prismaProfile.province,
            city: prismaProfile.city,
            profile_picture: prismaProfile.profile_picture
        });
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

    static toPrismaUpdate(data: Partial<User>) {
        const { profile, ...updateData } = data;

        return {
            ...updateData,
            profile: profile ? {
                upsert: {
                    create: {
                        birthdate: new Date(profile.birthdate),
                        phone: profile.phone,
                        country: profile.country,
                        province: profile.province,
                        city: profile.city,
                        profile_picture: profile.profile_picture
                    },
                    update: {
                        birthdate: new Date(profile.birthdate),
                        phone: profile.phone,
                        country: profile.country,
                        province: profile.province,
                        city: profile.city,
                        profile_picture: profile.profile_picture
                    }
                }
            } : undefined
        };
    }

    static toProfileDto(user: User): ProfileDto {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            profile: user.profile ? {
                profile_picture: user.profile.profile_picture,
                birthdate: user.profile.birthdate,
                phone: user.profile.phone,
                country: user.profile.country,
                province: user.profile.province,
                city: user.profile.city,
            } : undefined,
        };
    }

    static toAdminProfileDto(user: any): AdminProfileDto {
        const moduleMap: Record<string, Set<string>> = {};
        let role = '';
        (user.user_roles || []).forEach((userRole: any, idx: number) => {
            if (idx === 0 && userRole.role?.name) {
                role = userRole.role.name;
            }
            userRole.role?.module_permissions?.forEach((perm: any) => {
                const moduleName = perm.module?.name;
                const permission = perm.permission;
                if (moduleName) {
                    if (!moduleMap[moduleName]) {
                        moduleMap[moduleName] = new Set();
                    }
                    moduleMap[moduleName].add(permission);
                }
            });
        });
        const modules = Object.entries(moduleMap).map(([name, permissions]) => ({
            name,
            permissions: Array.from(permissions)
        }));
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            type: user.type,
            role,
            profile: user.profile ? {
                profile_picture: user.profile.profile_picture,
                birthdate: user.profile.birthdate,
                phone: user.profile.phone,
                country: user.profile.country,
                province: user.profile.province,
                city: user.profile.city,
            } : undefined,
            modules
        };
    }
}