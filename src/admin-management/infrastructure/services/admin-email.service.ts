import { Injectable } from '@nestjs/common';
import { MailService } from '../../../shared/infrastructure/services/mail.service';
import { AdminCreatedTemplate } from '../templates/admin-created.template';

@Injectable()
export class AdminEmailService {
  constructor(private readonly mailService: MailService) {}

  async sendAdminCredentials(email: string, name: string, password: string): Promise<void> {
    const html = AdminCreatedTemplate.generate(name, password);

    await this.mailService.sendEmail({
      to: email,
      subject: 'Your Admin Account - Jardín Digital',
      html: html
    });
  }
}