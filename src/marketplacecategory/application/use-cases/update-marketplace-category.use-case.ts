import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { MarketplaceCategory } from '../../domain/entities/marketplace-category.entity';
import { IMarketplaceCategoryRepository } from '../../domain/interfaces/marketplace-category.repository.interface';
import { UpdateMarketplaceCategoryDto } from '../dtos/update-marketplace-category.dto';
import { MarketplaceCategoryMapper } from '../../infrastructure/mappers/marketplace-category.mapper';

@Injectable()
export class UpdateMarketplaceCategoryUseCase {
  constructor(
    @Inject('IMarketplaceCategoryRepository')
    private readonly repository: IMarketplaceCategoryRepository,
    private readonly mapper: MarketplaceCategoryMapper
  ) {}

  async execute(id: string, dto: UpdateMarketplaceCategoryDto): Promise<MarketplaceCategory> {
    const categoryData = await this.repository.findById(id);
    if (!categoryData) {
      throw new NotFoundException('Category not found');
    }

    if (dto.name && dto.name !== categoryData.name) {
      const existingCategory = await this.repository.findByName(dto.name);
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category name already exists');
      }
    }

    const updatedData = await this.repository.update(id, dto);
    return this.mapper.toDomain(updatedData);
  }
}
