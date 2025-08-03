import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './presentation/controllers/auth.controller';
import { LoginAdminUseCase } from './application/use-cases/admin/login-admin.use-case';
import { LoginUseCase } from './application/use-cases/general/login.use-case';
import { RegisterUserUseCase } from './application/use-cases/general/register-user.use-case';
import { ResendVerificationCodeUseCase } from './application/use-cases/general/resend-verification-code.use-case';
import { VerifyTokenUseCase } from './application/use-cases/general/verify-token.use-case';
import { ForgotPasswordUseCase } from './application/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { JwtService } from './infrastructure/services/jwt.service';
import { EmailService } from './infrastructure/services/email.service';
import { AuthMapper } from './infrastructure/mappers/auth.mapper';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';
import { PrismaService } from '../shared/infrastructure/services/prisma.service';
import { PasswordService } from './infrastructure/services/passoword.service';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        SharedModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get<string>('JWT_EXPIRES_IN'),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        LoginAdminUseCase,
        LoginUseCase,
        RegisterUserUseCase,
        ResendVerificationCodeUseCase,
        VerifyTokenUseCase,
        ForgotPasswordUseCase,
        ResetPasswordUseCase,
        {
            provide: 'IAuthRepository',
            useClass: AuthRepository
        },
        {
            provide: 'IJwtService',
            useClass: JwtService
        },
        {
            provide: 'IPasswordService',
            useClass: PasswordService
        },
        EmailService,
        AuthMapper,
        JwtStrategy,
        PrismaService,
    ],
    exports: [JwtStrategy, PassportModule, 'IJwtService'],
})
export class AuthModule {}