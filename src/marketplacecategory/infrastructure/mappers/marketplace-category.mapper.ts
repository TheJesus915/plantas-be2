import { Injectable } from '@nestjs/common';
import { MarketplaceCategory } from '../../domain/entities/marketplace-category.entity';

@Injectable()
export class MarketplaceCategoryMapper {
  toDomain(data: any): MarketplaceCategory {
    return new MarketplaceCategory(
      data.id,
      data.name,
      data.image_url,
      data.is_active,
      data.parent_id,
      data.created_at
    );
  }

  toListResponse(category: MarketplaceCategory) {
    return {
      id: category.id,
      name: category.name,
      image_url: category.image_url,
      is_active: category.is_active,
      created_at: category.created_at
    };
  }

  toMobileResponse(category: MarketplaceCategory) {
    return {
      id: category.id,
      name: category.name,
      image_url: category.image_url
    };
  }
}
