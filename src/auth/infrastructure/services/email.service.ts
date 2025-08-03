import { Injectable } from '@nestjs/common';
import { MailService } from '../../../shared/infrastructure/services/mail.service';
import { ResetPasswordTemplate } from '../templates/reset-password.template';
import { VerificationCodeTemplate } from '../templates/verification-code.template';

@Injectable()
export class EmailService {
    constructor(private readonly mailService: MailService) {}

    async sendResetCode(email: string, name: string, code: string): Promise<void> {
        const html = ResetPasswordTemplate.generate(name, code);

        await this.mailService.sendEmail({
            to: email,
            subject: 'Reset your password - Jardín Digital',
            html: html
        });
    }

    async sendVerificationCode(email: string, name: string, code: string): Promise<void> {
        const html = VerificationCodeTemplate.generate(name, code);

        await this.mailService.sendEmail({
            to: email,
            subject: 'Verify your account - Jardín Digital',
            html: html
        });
    }
}