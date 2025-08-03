import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import {
    IUserRepository,
    CreateUserData,
} from '../../domain/interfaces/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private prisma: PrismaService) {}


    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                profile: true,
            },
        });

        return user ? UserMapper.toDomain(user) : null;
    }

    async findByToken(token: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: { token_recovery: token },
            include: {
                profile: true,
            },
        });

        return user ? UserMapper.toDomain(user) : null;
    }

    async findByEmailAndToken(email: string, token: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                email,
                token_recovery: token,
            },
            include: {
                profile: true,
            },
        });

        return user ? UserMapper.toDomain(user) : null;
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
            },
        });

        return user ? UserMapper.toDomain(user) : null;
    }

    async findByResetToken(resetToken: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: { reset_token: resetToken },
            include: {
                profile: true,
            },
        });

        return user ? UserMapper.toDomain(user) : null;
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const user = await this.prisma.user.update({
            where: { id },
            data: UserMapper.toPrismaUpdate(data),
            include: {
                profile: true,
            },
        });

        return UserMapper.toDomain(user);
    }

    async getProfile(userId: string): Promise<User | null> {
        if (!userId) {
            return null;
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
            },
        });

        return user ? UserMapper.toDomain(user) : null;
    }

    async getProfileAdmin(userId: string): Promise<any> {
        if (!userId) {
            return null;
        }
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                user_roles: {
                    include: {
                        role: {
                            include: {
                                module_permissions: {
                                    include: {
                                        module: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}