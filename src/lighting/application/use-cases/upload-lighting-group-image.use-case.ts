import { Injectable, BadRequestException } from '@nestjs/common';
import { LightingImageService, MulterFile } from '../../infrastructure/services/lighting-image.service';

@Injectable()
export class UploadLightingGroupImageUseCase {
  private readonly subFolder = 'groups';

  constructor(private readonly lightingImageService: LightingImageService) {}

  async execute(file: MulterFile): Promise<string> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException(`The file ${file.originalname} is not an image`);
    }

    return this.lightingImageService.uploadImage(file, this.subFolder);
  }
}
