import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MarketplaceCategory } from '../../domain/entities/marketplace-category.entity';
import { IMarketplaceCategoryRepository } from '../../domain/interfaces/marketplace-category.repository.interface';
import { CreateMarketplaceCategoryDto } from '../dtos/create-marketplace-category.dto';
import { MarketplaceCategoryMapper } from '../../infrastructure/mappers/marketplace-category.mapper';

@Injectable()
export class CreateMarketplaceCategoryUseCase {
  constructor(
    @Inject('IMarketplaceCategoryRepository')
    private readonly repository: IMarketplaceCategoryRepository,
    private readonly mapper: MarketplaceCategoryMapper
  ) {}

  async execute(dto: CreateMarketplaceCategoryDto): Promise<MarketplaceCategory> {
    const existingCategory = await this.repository.findByName(dto.name);
    if (existingCategory) {
      throw new ConflictException('Category name already exists');
    }

    const category = MarketplaceCategory.create(
      uuidv4(),
      dto.name,
      dto.image_url || null,
      true,
      dto.parent_id || null
    );

    const createdCategory = await this.repository.create(category);
    return this.mapper.toDomain(createdCategory);
  }
}
