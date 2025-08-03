import { Injectable, BadRequestException, ConflictException, InternalServerErrorException, Inject } from '@nestjs/common';
import { RegisterUserDto } from '../../dtos/general/register-user.dto';
import { EmailService } from '../../../infrastructure/services/email.service';
import { IAuthRepository } from '../../../domain/interfaces/auth-repository.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUserUseCase {
    constructor(
        @Inject('IAuthRepository')
        private readonly authRepository: IAuthRepository,
        private readonly emailService: EmailService
    ) {}

    async execute(registerData: RegisterUserDto): Promise<{ id: string }> {
        try {
            if (registerData.password !== registerData.confirmPassword) {
                throw new BadRequestException('Passwords do not match');
            }

            const existingUserByEmail = await this.authRepository.findByEmail(registerData.email);
            if (existingUserByEmail) {
                throw new ConflictException('Email is already registered');
            }

            const hashedPassword = await bcrypt.hash(registerData.password, 10);

            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            const tokenExpiration = new Date();
            tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 15);

            const user = await this.authRepository.create({
                email: registerData.email,
                password: hashedPassword,
                name: registerData.name,
                lastname: registerData.lastname,
                type: 'general',
                token_recovery: verificationToken,
                token_exp: tokenExpiration,
                status_account: 'Pending',
                profile: {
                    birthdate: registerData.birthdate,
                    phone: registerData.phone,
                    country: registerData.country,
                    province: registerData.province,
                    city: registerData.city,
                    profile_picture: registerData.profile_picture
                }
            });

            await this.emailService.sendVerificationCode(
                user.email,
                user.name,
                verificationToken
            );

            return { id: user.id };
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            throw new InternalServerErrorException('An error occurred while registering the user');
        }
    }
}
