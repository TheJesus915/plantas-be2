import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { WateringImageService, MulterFile } from '../../infrastructure/services/watering-image.service';
import { GetWateringGroupByIdUseCase } from './get-watering-group-by-id.use-case';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';

@Injectable()
export class UpdateWateringGroupImageUseCase {
  private readonly subFolder = 'groups';

  constructor(
    private readonly wateringImageService: WateringImageService,
    private readonly getWateringGroupByIdUseCase: GetWateringGroupByIdUseCase,
    @Inject('IWateringRepository')
    private readonly wateringRepository: IWateringRepository
  ) {}

  async execute(userId: string, groupId: string, file: MulterFile): Promise<string> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    const group = await this.getWateringGroupByIdUseCase.execute(userId, groupId);
    if (!group) {
      throw new NotFoundException('Watering group not found');
    }

    let imageUrl: string;

    if (!group.imageUrl) {
      imageUrl = await this.wateringImageService.uploadImage(file, this.subFolder);
    } else {
      imageUrl = await this.wateringImageService.updateImage(group.imageUrl, file, this.subFolder);
    }
    await this.wateringRepository.updateWateringGroup(groupId, { imageUrl });

    return imageUrl;
  }
}
