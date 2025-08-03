import { Injectable, Inject, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { IAuthRepository } from '../../domain/interfaces/auth-repository.interface';
import { EmailService } from '../../infrastructure/services/email.service';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { StatusAccount, Role } from '@prisma/client';

@Injectable()
export class ForgotPasswordUseCase {
    constructor(
      @Inject('IAuthRepository')
      private readonly authRepository: IAuthRepository,
      private readonly emailService: EmailService,
    ) {}

    async execute(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
        const { email } = forgotPasswordDto;

        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }


        if (user.status_account === StatusAccount.Inactive) {
            throw new UnauthorizedException('Account is inactive');
        }

        if (user.status_account === StatusAccount.Pending) {
            throw new UnauthorizedException('Account pending activation');
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 15);

        await this.authRepository.saveResetCode(user.id, resetCode, expirationTime);


        const displayName = user.name || 'User';
        await this.emailService.sendResetCode(email, displayName, resetCode);

        return { message: 'Reset code sent successfully' };
    }
}