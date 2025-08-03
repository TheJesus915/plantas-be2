import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginAdminUseCase } from '../../application/use-cases/admin/login-admin.use-case';
import { LoginUseCase } from '../../application/use-cases/general/login.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/general/register-user.use-case';
import { ResendVerificationCodeUseCase } from '../../application/use-cases/general/resend-verification-code.use-case';
import { VerifyTokenUseCase } from '../../application/use-cases/general/verify-token.use-case';
import { ForgotPasswordUseCase } from '../../application/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password.use-case';
import { LoginDto } from '../../application/dtos/login.dto';
import { ForgotPasswordDto } from '../../application/dtos/forgot-password.dto';
import { ResetPasswordDto } from '../../application/dtos/reset-password.dto';
import { RegisterUserDto } from '../../application/dtos/general/register-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
      private readonly loginAdminUseCase: LoginAdminUseCase,
      private readonly loginGeneralUseCase: LoginUseCase,
      private readonly registerUserUseCase: RegisterUserUseCase,
      private readonly resendVerificationCodeUseCase: ResendVerificationCodeUseCase,
      private readonly verifyTokenUseCase: VerifyTokenUseCase,
      private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
      private readonly resetPasswordUseCase: ResetPasswordUseCase,
    ) {}

    @Post('login-admin')
    @HttpCode(HttpStatus.OK)
    async loginAdmin(@Body() loginDto: LoginDto) {
        return this.loginAdminUseCase.execute(loginDto);
    }

    @Post('login-general')
    @HttpCode(HttpStatus.OK)
    async loginGeneral(@Body() loginDto: LoginDto) {
        return this.loginGeneralUseCase.execute(loginDto);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterUserDto) {
        return this.registerUserUseCase.execute(registerDto);
    }

    @Post('verify')
    @HttpCode(HttpStatus.OK)
    async verify(@Body() verifyDto: { email: string; token: string }) {
        return this.verifyTokenUseCase.execute(verifyDto.email, verifyDto.token);
    }

    @Post('resend-verification')
    @HttpCode(HttpStatus.OK)
    async resendVerification(@Body() resendDto: { email: string }) {
        return this.resendVerificationCodeUseCase.execute(resendDto.email);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.forgotPasswordUseCase.execute(forgotPasswordDto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.resetPasswordUseCase.execute(resetPasswordDto);
    }
}