import { Inject, Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { StorageService } from '../../../../shared/infrastructure/services/storage.service';
import { UserProfile } from '../../../domain/entities/user-profile.entity';

@Injectable()
export class UploadProfilePhotoUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(userId: string, file: Buffer): Promise<string> {
    try {
      if (!userId || userId.trim() === '') {
        throw new BadRequestException('User ID is required');
      }

      if (!file || file.length === 0) {
        throw new BadRequestException('File is required');
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const fileExtension = 'jpeg';
      const filePath = `profile-photos/${userId}.${fileExtension}`;

      const { url } = await this.storageService.uploadFile(
        filePath,
        file,
        'image/jpeg',
      );

      if (user.profile) {
        const updatedProfile = new UserProfile({
          ...user.profile,
          profile_picture: url
        });

        await this.userRepository.update(userId, {
          profile: updatedProfile
        });
      } else {
        throw new NotFoundException('User profile does not exist');
      }

      return userId;
    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while uploading the profile photo');
    }
  }
}