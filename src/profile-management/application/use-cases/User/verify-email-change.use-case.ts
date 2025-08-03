import { Injectable, Inject, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { VerifyEmailChangeDto } from '../../dtos/User/verify-email-change.dto';

@Injectable()
export class VerifyEmailChangeUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(userId: string, dto: VerifyEmailChangeDto): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.type !== 'general') {
      throw new ForbiddenException('Access denied');
    }

    if (user.token_recovery !== dto.token) {
      throw new BadRequestException('Códe of verification incorrect');
    }

    const now = new Date();
    if (!user.token_exp || user.token_exp < now) {
      throw new BadRequestException('The verification code has expired');
    }

    await this.userRepository.update(userId, {
      email: dto.email,
      token_recovery: null,
      token_exp: null
    });

    return {
      success: true,
      message: 'Email updated successfully'
    };
  }
}