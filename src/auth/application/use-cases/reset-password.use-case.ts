import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { IAuthRepository } from '../../domain/interfaces/auth-repository.interface';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ResetPasswordUseCase {
    constructor(
      @Inject('IAuthRepository')
      private readonly authRepository: IAuthRepository,
    ) {}

    async execute(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
        const { email, code, newPassword } = resetPasswordDto;

        const user = await this.authRepository.findByEmailWithResetData(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.reset_token || user.reset_token !== code) {
            throw new BadRequestException('Invalid or expired reset code');
        }

        if (!user.reset_token_exp || new Date() > user.reset_token_exp) {
            throw new BadRequestException('Invalid or expired reset code');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.authRepository.updatePasswordAndClearResetCode(user.id, hashedPassword);

        return { message: 'Password reset successfully' };
    }
}