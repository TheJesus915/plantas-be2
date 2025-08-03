import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';

import { CatalogPlantController } from './presentation/controllers/catalog-plant.controller';
import { PlantImagesController } from './presentation/controllers/plant-images.controller';
import { CreateCatalogPlantUseCase } from './application/use-cases/catalog-plant/create-catalog-plant.use-case';
import { GetCatalogPlantByIdUseCase } from './application/use-cases/catalog-plant/get-catalog-plant-by-id.use-case';
import { GetAllCatalogPlantsUseCase } from './application/use-cases/catalog-plant/get-all-catalog-plants.use-case';
import { UploadPlantImagesUseCase } from './application/use-cases/plant-images/upload-plant-images.use-case';
import { LinkPlantImageUseCase } from './application/use-cases/plant-images/link-plant-images.use-case';
import { DeletePlantImageUseCase } from './application/use-cases/plant-images/delete-plant-image.use-case';
import { CatalogPlantRepository } from './infrastructure/repositories/catalog-plant.repository';
import { PlantImagesRepository } from './infrastructure/repositories/plant-images.repository';
import { CatalogPlantMapper } from './infrastructure/mappers/catalog-plant.mapper';
import { PlantImagesMapper } from './infrastructure/mappers/plant-images.mapper';
import { PlantImagesService } from './infrastructure/services/plant-images.service';
import { DeleteCatalogPlantUseCase } from './application/use-cases/catalog-plant/delete-catalog-plant.use-case';
import { UpdateCatalogPlantUseCase } from './application/use-cases/catalog-plant/update-catalog-plant.use-case';
import { UpdatePlantImageFileUseCase } from './application/use-cases/plant-images/update-plant-image-file.use-case';
import { CatalogPlantsPotController } from './presentation/controllers/catalog-plant-user.controller';


@Module({
  imports: [SharedModule],
  controllers: [
    CatalogPlantController,
    PlantImagesController,
    CatalogPlantsPotController
  ],
  providers: [
    CreateCatalogPlantUseCase,
    GetCatalogPlantByIdUseCase,
    GetAllCatalogPlantsUseCase,
    DeleteCatalogPlantUseCase,
    UpdateCatalogPlantUseCase,
    UpdatePlantImageFileUseCase,
    UploadPlantImagesUseCase,
    LinkPlantImageUseCase,
    DeletePlantImageUseCase,
    PlantImagesService,
    CatalogPlantRepository,
    PlantImagesRepository,
    {
      provide: 'ICatalogPlantRepository',
      useClass: CatalogPlantRepository,
    },
    {
      provide: 'IPlantImagesRepository',
      useClass: PlantImagesRepository,
    },
    CatalogPlantMapper,
    PlantImagesMapper,
  ],
  exports: [
    CreateCatalogPlantUseCase,
    UploadPlantImagesUseCase,
    LinkPlantImageUseCase,
    DeletePlantImageUseCase,
    CatalogPlantRepository,
    PlantImagesRepository,
  ],
})
export class PlantsModule {}