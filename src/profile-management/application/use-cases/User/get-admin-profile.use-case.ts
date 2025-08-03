import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';

@Injectable()
export class GetAdminProfileUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.getProfileAdmin(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.type !== 'admin' && user.type !== 'superadmin') {
      throw new ForbiddenException('Access denied');
    }
    return UserMapper.toAdminProfileDto(user);
  }
}
