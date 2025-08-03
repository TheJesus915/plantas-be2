import { Inject, Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { UpdateProfileDto } from '../../dtos/User/update-profile.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, updateData: UpdateProfileDto): Promise<{ id: string }> {
    try {
      if (!userId || userId.trim() === '') {
        throw new BadRequestException('User ID is required');
      }

      const existingUser = await this.userRepository.findById(userId);

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const dataToUpdate: any = {};

      if (updateData.name !== undefined) {
        dataToUpdate.name = updateData.name;
      }

      if (updateData.lastname !== undefined) {
        dataToUpdate.lastname = updateData.lastname;
      }

      if (updateData.profile) {
        dataToUpdate.profile = {};

        if (updateData.profile.birthdate) {
          dataToUpdate.profile.birthdate = new Date(updateData.profile.birthdate);
        }

        if (updateData.profile.phone !== undefined) {
          dataToUpdate.profile.phone = updateData.profile.phone;
        }

        if (updateData.profile.country !== undefined) {
          dataToUpdate.profile.country = updateData.profile.country;
        }

        if (updateData.profile.province !== undefined) {
          dataToUpdate.profile.province = updateData.profile.province;
        }

        if (updateData.profile.city !== undefined) {
          dataToUpdate.profile.city = updateData.profile.city;
        }

        if (existingUser.profile && existingUser.profile.profile_picture) {
          dataToUpdate.profile.profile_picture = existingUser.profile.profile_picture;
        }
      }

      await this.userRepository.update(userId, dataToUpdate);

      return { id: userId };
    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while updating the profile');
    }
  }
}