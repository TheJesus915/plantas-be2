import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';

import { MarketplaceCategoryController } from './presentation/controllers/marketplace-category.controller';
import { CreateMarketplaceCategoryUseCase } from './application/use-cases/create-marketplace-category.use-case';
import { UploadMarketplaceCategoryImageUseCase } from './application/use-cases/upload-marketplace-category-image.use-case';
import { UpdateMarketplaceCategoryUseCase } from './application/use-cases/update-marketplace-category.use-case';
import { UpdateMarketplaceCategoryImageUseCase } from './application/use-cases/update-marketplace-category-image.use-case';
import { DeleteMarketplaceCategoryImageUseCase } from './application/use-cases/delete-marketplace-category-image.use-case';
import { GetMarketplaceCategoriesUseCase } from './application/use-cases/get-marketplace-categories.use-case';
import { GetMarketplaceCategoriesMobileUseCase } from './application/use-cases/get-marketplace-categories-mobile.use-case';
import { MarketplaceCategoryRepository } from './infrastructure/repositories/marketplace-category.repository';
import { MarketplaceCategoryImageService } from './infrastructure/services/marketplace-category-image.service';
import { MarketplaceCategoryMapper } from './infrastructure/mappers/marketplace-category.mapper';

@Module({
  imports: [SharedModule],
  controllers: [MarketplaceCategoryController],
  providers: [
    CreateMarketplaceCategoryUseCase,
    UploadMarketplaceCategoryImageUseCase,
    UpdateMarketplaceCategoryUseCase,
    UpdateMarketplaceCategoryImageUseCase,
    DeleteMarketplaceCategoryImageUseCase,
    GetMarketplaceCategoriesUseCase,
    GetMarketplaceCategoriesMobileUseCase,
    MarketplaceCategoryImageService,
    MarketplaceCategoryRepository,
    MarketplaceCategoryMapper,
    {
      provide: 'IMarketplaceCategoryRepository',
      useClass: MarketplaceCategoryRepository,
    },
  ],
})
export class MarketplacecategoryModule {}
