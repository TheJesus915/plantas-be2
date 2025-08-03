import { Inject, Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { StorageService } from '../../../../shared/infrastructure/services/storage.service';

@Injectable()
export class DeleteProfilePhotoUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly storageService: StorageService,
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

      if (user.profile?.profile_picture) {
        try {
          const filePath = `profile-photos/${userId}.jpeg`;
          await this.storageService.deleteFile(filePath);
        } catch (error) {
          console.error('Error deleting profile photo from storage', error);
        }

        await this.userRepository.update(userId, {
          profile: {
            ...user.profile,
            profile_picture: null
          }
        });
      }
    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while deleting the profile photo');
    }
  }
}