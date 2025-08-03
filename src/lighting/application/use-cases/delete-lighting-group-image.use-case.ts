import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';
import { LightingImageService } from '../../infrastructure/services/lighting-image.service';

@Injectable()
export class DeleteLightingGroupImageUseCase {
  constructor(
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository,
    private readonly lightingImageService: LightingImageService
  ) {}

  async execute(userId: string, groupId: string): Promise<void> {
    const group = await this.lightingRepository.findLightingGroupById(groupId);
    if (!group) {
      throw new NotFoundException('Lighting group not found');
    }

    if (group.user_id !== userId) {
      throw new NotFoundException('Lighting group not found');
    }
    if (group.image_url) {
      await this.lightingImageService.deleteImage(group.image_url);
    }
    await this.lightingRepository.updateLightingGroup(groupId, {
      imageUrl: ''
    });
  }
}
