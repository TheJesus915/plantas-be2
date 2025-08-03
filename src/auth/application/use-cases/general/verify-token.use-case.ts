import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { IAuthRepository } from '../../../domain/interfaces/auth-repository.interface';

@Injectable()
export class VerifyTokenUseCase {
    constructor(
        @Inject('IAuthRepository')
        private readonly authRepository: IAuthRepository
    ) {}

    async execute(email: string, token: string): Promise<{ success: boolean; message: string }> {
        const user = await this.authRepository.findByEmailAndToken(email, token);

        if (!user) {
            throw new BadRequestException('Invalid token or email');
        }

        if (user.token_exp && user.token_exp < new Date()) {
            throw new BadRequestException('Token has expired');
        }

        if (user.status_account !== 'Pending') {
            throw new BadRequestException('Account is already verified');
        }

        await this.authRepository.activateAccount(user.id);

        return {
            success: true,
            message: 'Account verified successfully'
        };
    }
}
