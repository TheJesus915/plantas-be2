import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  InternalServerErrorException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { GetAllCatalogPlantsUseCase } from '../../application/use-cases/catalog-plant/get-all-catalog-plants.use-case';
import { GetCatalogPlantByIdUseCase } from '../../application/use-cases/catalog-plant/get-catalog-plant-by-id.use-case';

@Controller('pots/catalog-plants')
@UseGuards(JwtAuthGuard)
export class CatalogPlantsPotController {
  constructor(
    private readonly getAllCatalogPlantsUseCase: GetAllCatalogPlantsUseCase,
    private readonly getCatalogPlantByIdUseCase: GetCatalogPlantByIdUseCase,
  ) {}

  @Get()
  async getCatalogPlants(@Query() filter: PaginationFilterDto) {
    try {
      return await this.getAllCatalogPlantsUseCase.execute(filter);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching catalog plants: ' + error.message);
    }
  }

  @Get(':id')
  async getPlantById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('fulldata') fulldata?: string
  ) {
    const full = fulldata === 'true';
    return await this.getCatalogPlantByIdUseCase.execute(id, full);
  }
}