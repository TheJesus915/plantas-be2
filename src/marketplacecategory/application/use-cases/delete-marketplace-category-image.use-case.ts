import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { MarketplaceCategory } from '../../domain/entities/marketplace-category.entity';
import { IMarketplaceCategoryRepository } from '../../domain/interfaces/marketplace-category.repository.interface';
import { MarketplaceCategoryImageService } from '../../infrastructure/services/marketplace-category-image.service';
import { MarketplaceCategoryMapper } from '../../infrastructure/mappers/marketplace-category.mapper';

@Injectable()
export class DeleteMarketplaceCategoryImageUseCase {
  constructor(
    @Inject('IMarketplaceCategoryRepository')
    private readonly repository: IMarketplaceCategoryRepository,
    private readonly imageService: MarketplaceCategoryImageService,
    private readonly mapper: MarketplaceCategoryMapper
  ) {}

  async execute(id: string): Promise<MarketplaceCategory> {
    const categoryData = await this.repository.findById(id);
    if (!categoryData) {
      throw new NotFoundException('Category not found');
    }

    if (categoryData.image_url) {
      await this.imageService.deleteImage(categoryData.image_url);
    }

    const updatedData = await this.repository.removeImage(id);
    return this.mapper.toDomain(updatedData);
  }
}
