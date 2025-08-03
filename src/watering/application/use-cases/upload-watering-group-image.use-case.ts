import { Injectable, BadRequestException } from '@nestjs/common';
import { WateringImageService, MulterFile } from '../../infrastructure/services/watering-image.service';

@Injectable()
export class UploadWateringGroupImageUseCase {
  private readonly subFolder = 'groups';

  constructor(private readonly wateringImageService: WateringImageService) {}

  async execute(file: MulterFile): Promise<string> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException(`The file ${file.originalname} is not an image`);
    }

    return this.wateringImageService.uploadImage(file, this.subFolder);
  }
}
