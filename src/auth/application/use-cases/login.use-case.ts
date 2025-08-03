import { Inject, UnauthorizedException } from '@nestjs/common';
import { IAuthRepository } from '../../domain/interfaces/auth-repository.interface';
import { IJwtService } from '../../domain/interfaces/jwt-service.interface';
import { IPasswordService } from '../../domain/interfaces/password-service.interface';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { StatusAccount, User } from '@prisma/client';

export abstract class BaseLoginUseCase {
  constructor(
    @Inject('IAuthRepository')
    protected readonly authRepository: IAuthRepository,
    @Inject('IJwtService')
    protected readonly jwtService: IJwtService,
    @Inject('IPasswordService')
    protected readonly passwordService: IPasswordService
  ) {}

  protected async validateUser(email: string, password: string): Promise<User> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status_account === StatusAccount.Pending) {
      throw new UnauthorizedException('Account pending activation');
    }

    if (user.status_account === StatusAccount.Inactive) {
      throw new UnauthorizedException('Account is inactive');
    }

    return user;
  }

  protected createJwtPayload(user: any): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      type: user.type,
      name: user.name || user.email,
      picture: user.profile?.profile_picture || null,
    };
  }
}