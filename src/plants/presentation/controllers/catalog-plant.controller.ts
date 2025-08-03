import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CreateCatalogPlantUseCase } from '../../application/use-cases/catalog-plant/create-catalog-plant.use-case';
import { GetCatalogPlantByIdUseCase } from '../../application/use-cases/catalog-plant/get-catalog-plant-by-id.use-case';
import { GetAllCatalogPlantsUseCase } from '../../application/use-cases/catalog-plant/get-all-catalog-plants.use-case';
import { UpdateCatalogPlantUseCase } from '../../application/use-cases/catalog-plant/update-catalog-plant.use-case';
import { DeleteCatalogPlantUseCase } from '../../application/use-cases/catalog-plant/delete-catalog-plant.use-case';
import { CreateCatalogPlantDto } from '../../application/dtos/catalog-plant/create-catalog-plant-dto';
import { UpdateCatalogPlantDto } from '../../application/dtos/catalog-plant/update-catalog-plant.dto';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import {
  ModulePermissionGuard,
  RequirePermission,
} from '../../../shared/infrastructure/guards/module-permission.guard';
import { PermissionAction } from '@prisma/client';

@Controller('catalog-plants')
@UseGuards(JwtAuthGuard, ModulePermissionGuard)
export class CatalogPlantController {
  constructor(
    private readonly createCatalogPlantUseCase: CreateCatalogPlantUseCase,
    private readonly getCatalogPlantByIdUseCase: GetCatalogPlantByIdUseCase,
    private readonly getAllCatalogPlantsUseCase: GetAllCatalogPlantsUseCase,
    private readonly updateCatalogPlantUseCase: UpdateCatalogPlantUseCase,
    private readonly deleteCatalogPlantUseCase: DeleteCatalogPlantUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('plants', PermissionAction.CREATE)
  async createPlant(@Body() dto: CreateCatalogPlantDto) {
    return await this.createCatalogPlantUseCase.execute(dto);
  }

  @Get()
  @RequirePermission('plants', PermissionAction.READ)
  async getAllPlants(@Query() filter: PaginationFilterDto) {
    return await this.getAllCatalogPlantsUseCase.execute(filter);
  }

  @Get(':id')
  @RequirePermission('plants', PermissionAction.READ)
  async getPlantById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('fulldata') fulldata?: string
  ) {
    const full = fulldata === 'true';
    return await this.getCatalogPlantByIdUseCase.execute(id, full);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('plants', PermissionAction.UPDATE)
  async updatePlant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCatalogPlantDto
  ) {
    return await this.updateCatalogPlantUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('plants', PermissionAction.DELETE)
  async deletePlant(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteCatalogPlantUseCase.execute(id);
  }
}