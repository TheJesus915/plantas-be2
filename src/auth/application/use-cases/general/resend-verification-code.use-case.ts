import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { IAuthRepository } from '../../../domain/interfaces/auth-repository.interface';
import { EmailService } from '../../../infrastructure/services/email.service';

@Injectable()
export class ResendVerificationCodeUseCase {
    constructor(
        @Inject('IAuthRepository')
        private readonly authRepository: IAuthRepository,
        private readonly emailService: EmailService
    ) {}

    async execute(email: string): Promise<{ success: boolean; message: string }> {
        const user = await this.authRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.status_account === 'Active') {
            throw new BadRequestException('Account is already verified');
        }

        if (user.status_account !== 'Pending') {
            throw new BadRequestException('Account cannot receive verification codes');
        }

        const newToken = Math.floor(100000 + Math.random() * 900000).toString();

        const tokenExpiration = new Date();
        tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 15);

        await this.authRepository.updateVerificationToken(user.id, newToken, tokenExpiration);

        await this.emailService.sendVerificationCode(
            user.email,
            user.name,
            newToken
        );

        return {
            success: true,
            message: 'Verification code resent successfully'
        };
    }
}
