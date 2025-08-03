import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { ChangePasswordDto } from '../../dtos/User/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('the password is incorrect');
    }

    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException('the new password cannot be the same as the current password');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, salt);

    await this.userRepository.update(userId, {
      password: hashedPassword
    });

    return {
      message: 'password update successfully'
    };
  }
}