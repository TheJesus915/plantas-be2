import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { BaseLoginUseCase } from '../login.use-case';
import { LoginDto } from '../../dtos/login.dto';
import { Role } from '@prisma/client';

@Injectable()
export class LoginUseCase extends BaseLoginUseCase {
    async execute(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        if (user.type !== Role.general) {
            throw new UnauthorizedException('User is not general type');
        }

        const payload = this.createJwtPayload(user);
        const token = await this.jwtService.sign(payload);

        return {
            token,
        };
    }
}