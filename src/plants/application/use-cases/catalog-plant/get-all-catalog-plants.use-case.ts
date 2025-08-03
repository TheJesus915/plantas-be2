import { Injectable, Inject, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ICatalogPlantRepository } from '../../../domain/interfaces/catalog-plant-repository.interface';
import { PaginationService } from '../../../../shared/infrastructure/services/pagination.service';
import { PaginationFilterDto, PaginatedResponseDto } from '../../../../shared/application/dtos/pagination.dto';
import { CatalogPlantListItemDto } from '../../dtos/catalog-plant/catalog-plant-list-item.dto';
import { CatalogPlantMapper } from '../../../infrastructure/mappers/catalog-plant.mapper';

@Injectable()
export class GetAllCatalogPlantsUseCase {
  constructor(
    @Inject('ICatalogPlantRepository')
    private readonly catalogPlantRepository: ICatalogPlantRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async execute(filter: PaginationFilterDto): Promise<PaginatedResponseDto<CatalogPlantListItemDto>> {
    try {
      const searchFields = ['name', 'planttype'];
      const where = this.paginationService.buildWhereClauses(filter, searchFields);
      const { skip, take } = this.paginationService.getPaginationParameters(filter);
      const orderBy = this.paginationService.buildOrderByClause(filter, 'created_at');
      const { plants, total } = await this.catalogPlantRepository.findAllPaginated(where, skip, take, orderBy);
      const plantsList = plants.map(plant =>
        CatalogPlantMapper.toListItemDto(plant)
      );

      return this.paginationService.paginate(plantsList, total, filter);
    } catch (error) {

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while retrieving the plants');
    }
  }
}