import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { RequestEmailChangeDto } from '../../dtos/User/request-email-change.dto';
import { UserEmailService } from '../../../infrastructure/services/user-email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RequestEmailChangeUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly userEmailService: UserEmailService
  ) {}

  async execute(userId: string, dto: RequestEmailChangeDto): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('user not found');
    }
    if (user.type !== 'general') {
      throw new ForbiddenException('Access denied');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is incorrect');
    }

    const existingUser = await this.userRepository.findByEmail(dto.newEmail);
    if (existingUser) {
      throw new ConflictException('this email is already registered');
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();

    const tokenExpiration = new Date();
    tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 15);

    await this.userRepository.update(userId, {
      token_recovery: token,
      token_exp: tokenExpiration,
    });


    await this.userEmailService.sendEmailChangeVerification(
      dto.newEmail,
      user.name,
      token
    );

    return {
      success: true,
      message: 'A verification code has been sent to your new email address. Please check your inbox.',
    };
  }
}