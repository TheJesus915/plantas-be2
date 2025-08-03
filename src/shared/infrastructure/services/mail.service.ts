import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: {
        name: string;
        address: string;
    };
}

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(MailService.name);

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            secure: true,
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        this.verifyConnection();
    }

    private async verifyConnection() {
        try {
            await this.transporter.verify();
            this.logger.log('Mail server connection established successfully');
        } catch (error) {
            this.logger.error('Error connecting to mail server:', error);
        }
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            const mailOptions = {
                from: options.from || {
                    name: 'Jardín Digital',
                    address: this.configService.get<string>('MAIL_FROM')
                },
                to: options.to,
                subject: options.subject,
                html: options.html,
            };

            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent successfully to ${options.to}`);
        } catch (error) {
            this.logger.error(`Error sending email to ${options.to}:`, error);
            throw new Error('Error sending email');
        }
    }

    async sendSimpleEmail(to: string, subject: string, html: string): Promise<void> {
        return this.sendEmail({ to, subject, html });
    }
}