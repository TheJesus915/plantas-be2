import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { MarketplaceCategory } from '../../domain/entities/marketplace-category.entity';
import { IMarketplaceCategoryRepository } from '../../domain/interfaces/marketplace-category.repository.interface';
import { MarketplaceCategoryImageService } from '../../infrastructure/services/marketplace-category-image.service';
import { MarketplaceCategoryMapper } from '../../infrastructure/mappers/marketplace-category.mapper';

@Injectable()
export class UpdateMarketplaceCategoryImageUseCase {
  constructor(
    @Inject('IMarketplaceCategoryRepository')
    private readonly repository: IMarketplaceCategoryRepository,
    private readonly imageService: MarketplaceCategoryImageService,
    private readonly mapper: MarketplaceCategoryMapper
  ) {}

  async execute(id: string, file: Express.Multer.File): Promise<MarketplaceCategory> {
    const categoryData = await this.repository.findById(id);
    if (!categoryData) {
      throw new NotFoundException('Category not found');
    }

    if (!file) {
      throw new Error('No file provided');
    }

    let imageUrl: string;

    if (categoryData.image_url) {
      imageUrl = await this.imageService.updateExistingImage(categoryData.image_url, file);
    } else {
      imageUrl = await this.imageService.uploadImage(file);
    }

    const updatedData = await this.repository.updateImage(id, imageUrl);
    return this.mapper.toDomain(updatedData);
  }
}
