import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';

@Injectable()
export class DeactivateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    try {
      if (!userId || userId.trim() === '') {
        throw new BadRequestException('User ID is required');
      }

      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.type !== 'general') {
        throw new ForbiddenException('Access denied');
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const inactiveEmail = `${timestamp}@inactive.user`;

      await this.userRepository.update(userId, {
        email: inactiveEmail,
        status_account: 'Inactive'
      });
    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while deactivating the user');
    }
  }
}