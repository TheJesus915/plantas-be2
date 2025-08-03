import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { IAuthRepository } from '../../domain/interfaces/auth-repository.interface';
import { User } from '@prisma/client';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async findByEmailWithResetData(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findByEmailAndToken(email: string, token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        token_recovery: token,
      },
    });
  }

  async create(userData: any): Promise<User> {
    const { profile, ...userFields } = userData;

    if (profile && profile.birthdate && typeof profile.birthdate === 'string') {
      profile.birthdate = new Date(profile.birthdate);
    }
    return this.prisma.user.create({
      data: {
        ...userFields,
        profile: {
          create: profile,
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async saveResetCode(userId: string, resetCode: string, expirationTime: Date): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        reset_token: resetCode,
        reset_token_exp: expirationTime,
      },
    });
  }

  async updatePasswordAndClearResetCode(userId: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_exp: null,
      },
    });
  }

  async updateVerificationToken(userId: string, token: string, expirationTime: Date): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        token_recovery: token,
        token_exp: expirationTime,
      },
    });
  }

  async activateAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status_account: 'Active',
        token_recovery: null,
        token_exp: null,
      },
    });
  }
}
