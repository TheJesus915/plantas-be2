import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { ProfileDto } from '../../dtos/User/profile.dto';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ProfileDto> {
    const user = await this.userRepository.getProfile(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.type !== 'general') {
      throw new ForbiddenException('Access denied');
    }

    return UserMapper.toProfileDto(user);
  }
}