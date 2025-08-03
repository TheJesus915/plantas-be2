import { Injectable, Inject } from '@nestjs/common';
import { IMarketplaceCategoryRepository } from '../../domain/interfaces/marketplace-category.repository.interface';
import { GetMarketplaceCategoriesQueryDto } from '../dtos/get-marketplace-categories-query.dto';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';
import { PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';

@Injectable()
export class GetMarketplaceCategoriesMobileUseCase {
  constructor(
    @Inject('IMarketplaceCategoryRepository')
    private readonly repository: IMarketplaceCategoryRepository,
    private readonly paginationService: PaginationService
  ) {}

  async execute(query: GetMarketplaceCategoriesQueryDto): Promise<PaginatedResponseDto<any>> {
    const { data, totalItems } = await this.repository.findActiveByParentIdPaginated(
      query.parent_id || null,
      query
    );

    return this.paginationService.paginate(data, totalItems, query);
  }
}
