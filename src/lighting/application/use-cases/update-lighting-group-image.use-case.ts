import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { LightingImageService, MulterFile } from '../../infrastructure/services/lighting-image.service';
import { GetLightingGroupByIdUseCase } from './get-lighting-group-by-id.use-case';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';

@Injectable()
export class UpdateLightingGroupImageUseCase {
  private readonly subFolder = 'groups';

  constructor(
    private readonly lightingImageService: LightingImageService,
    private readonly getLightingGroupByIdUseCase: GetLightingGroupByIdUseCase,
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository
  ) {}

  async execute(userId: string, groupId: string, file: MulterFile): Promise<string> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const group = await this.getLightingGroupByIdUseCase.execute(userId, groupId);
    if (!group) {
      throw new NotFoundException('Lighting group not found');
    }

    let imageUrl: string;

    if (!group.imageUrl) {
      imageUrl = await this.lightingImageService.uploadImage(file, this.subFolder);
    } else {
      imageUrl = await this.lightingImageService.updateImage(group.imageUrl, file, this.subFolder);
    }

    await this.lightingRepository.updateLightingGroup(groupId, { imageUrl });

    return imageUrl;
  }
}
