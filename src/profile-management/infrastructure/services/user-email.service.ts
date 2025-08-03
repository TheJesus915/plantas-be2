import { Injectable } from '@nestjs/common';
import { MailService } from '../../../shared/infrastructure/services/mail.service';
import { VerificationTemplate } from '../templates/verification.template';

@Injectable()
export class UserEmailService {
    constructor(private readonly mailService: MailService) {}


    async sendEmailChangeVerification(email: string, name: string, token: string): Promise<void> {
        const html = VerificationTemplate.generateEmailChange(name, token);

        await this.mailService.sendEmail({
            to: email,
            subject: 'Verification for email change - Jardín Digital',
            html: html
        });
    }
}