import { Injectable, Inject } from '@nestjs/common';
import { MarketplaceCategory } from '../../domain/entities/marketplace-category.entity';
import { IMarketplaceCategoryRepository } from '../../domain/interfaces/marketplace-category.repository.interface';
import { GetMarketplaceCategoriesQueryDto } from '../dtos/get-marketplace-categories-query.dto';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';
import { PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';
import { MarketplaceCategoryMapper } from '../../infrastructure/mappers/marketplace-category.mapper';

@Injectable()
export class GetMarketplaceCategoriesUseCase {
  constructor(
    @Inject('IMarketplaceCategoryRepository')
    private readonly repository: IMarketplaceCategoryRepository,
    private readonly paginationService: PaginationService,
    private readonly mapper: MarketplaceCategoryMapper
  ) {}

  async execute(query: GetMarketplaceCategoriesQueryDto): Promise<PaginatedResponseDto<any>> {
    const { data, totalItems } = await this.repository.findByParentIdPaginated(
      query.parent_id || null,
      query
    );

    const mappedData = data.map(item => ({
      id: item.id,
      name: item.name,
      image_url: item.image_url,
      is_active: item.is_active,
      created_at: item.created_at
    }));

    return this.paginationService.paginate(mappedData, totalItems, query);
  }
}
