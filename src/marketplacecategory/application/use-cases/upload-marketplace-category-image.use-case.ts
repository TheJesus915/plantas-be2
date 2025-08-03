import { Injectable } from '@nestjs/common';
import { MarketplaceCategoryImageService } from '../../infrastructure/services/marketplace-category-image.service';

@Injectable()
export class UploadMarketplaceCategoryImageUseCase {
  constructor(
    private readonly imageService: MarketplaceCategoryImageService
  ) {}

  async execute(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('No file provided');
    }

    return await this.imageService.uploadImage(file);
  }
}
