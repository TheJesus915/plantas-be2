import { MarketplaceCategory } from '../entities/marketplace-category.entity';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

export interface IMarketplaceCategoryRepository {
  create(category: MarketplaceCategory): Promise<any>;
  findByName(name: string): Promise<any | null>;
  findById(id: string): Promise<any | null>;
  findByParentId(parentId: string | null): Promise<any[]>;
  findByParentIdPaginated(parentId: string | null, filter: PaginationFilterDto): Promise<{ data: any[]; totalItems: number }>;
  findActiveByParentId(parentId: string | null): Promise<any[]>;
  findActiveByParentIdPaginated(parentId: string | null, filter: PaginationFilterDto): Promise<{ data: any[]; totalItems: number }>;
  update(id: string, data: Partial<MarketplaceCategory>): Promise<any>;
  updateImage(id: string, imageUrl: string): Promise<any>;
  removeImage(id: string): Promise<any>;
}