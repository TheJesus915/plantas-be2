import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { WateringImageService } from '../../infrastructure/services/watering-image.service';
import { GetWateringGroupByIdUseCase } from './get-watering-group-by-id.use-case';
import { UpdateWateringGroupUseCase } from './update-watering-group.use-case';

@Injectable()
export class DeleteWateringGroupImageUseCase {
  constructor(
    private readonly wateringImageService: WateringImageService,
    private readonly getWateringGroupByIdUseCase: GetWateringGroupByIdUseCase,
    private readonly updateWateringGroupUseCase: UpdateWateringGroupUseCase
  ) {}

  async execute(userId: string, groupId: string): Promise<void> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const group = await this.getWateringGroupByIdUseCase.execute(userId, groupId);
    if (!group) {
      throw new NotFoundException('Watering group not found');
    }

    if (!group.imageUrl) {
      throw new BadRequestException('Group does not have an image');
    }

    await this.wateringImageService.deleteImage(group.imageUrl);

    await this.updateWateringGroupUseCase.execute(userId, groupId, {
      ...group,
      imageUrl: null
    });
  }
}
