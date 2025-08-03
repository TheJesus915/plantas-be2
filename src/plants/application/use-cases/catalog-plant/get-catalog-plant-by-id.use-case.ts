import { Injectable, Inject, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ICatalogPlantRepository } from '../../../domain/interfaces/catalog-plant-repository.interface';
import { CatalogPlantResponseDto } from '../../dtos/catalog-plant/catalog_plant-response.dto';
import { CatalogPlantMapper } from '../../../infrastructure/mappers/catalog-plant.mapper';

@Injectable()
export class GetCatalogPlantByIdUseCase {
  constructor(
    @Inject('ICatalogPlantRepository')
    private readonly catalogPlantRepository: ICatalogPlantRepository,
  ) {}

  async execute(id: string, fulldata = false): Promise<CatalogPlantResponseDto> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('Plant ID is required');
      }

      const plant = await this.catalogPlantRepository.findById(id);

      if (!plant) {
        throw new NotFoundException(`Plant with ID ${id} not found`);
      }

      const plantImages = 'plantimages' in plant ? plant.plantimages : [];
      const taxonomy = 'taxonomy' in plant ? plant.taxonomy : undefined;
      let ancestry: any[] | undefined = undefined;
      if (plant.taxonomicNodeId) {
        ancestry = await this.catalogPlantRepository.getTaxonomicAncestry(plant.taxonomicNodeId);
      }
      if (!fulldata && Array.isArray(ancestry)) {
        ancestry = ancestry.filter(node =>
          node.rank === 'FAMILY' || node.rank === 'GENUS' || node.rank === 'SPECIES'
        );
      }
      return CatalogPlantMapper.toDto(
        plant,
        plantImages,
        taxonomy,
        ancestry
      );
    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while retrieving the plant');
    }
  }
}