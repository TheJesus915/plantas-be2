import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ICatalogPlantRepository } from '../../../domain/interfaces/catalog-plant-repository.interface';
import { PlantInUseException } from '../../../domain/errors/plant-in-use.error';

@Injectable()
export class DeleteCatalogPlantUseCase {
  constructor(
    @Inject('ICatalogPlantRepository')
    private readonly catalogPlantRepository: ICatalogPlantRepository,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const existingPlant = await this.catalogPlantRepository.findById(id);

      if (!existingPlant) {
        throw new NotFoundException(`Plant with ID ${id} not found`);
      }

      const isPlantInUse = await this.catalogPlantRepository.isPlantInUse(id);
      if (isPlantInUse) {
        throw new PlantInUseException(id);
      }

      await this.catalogPlantRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof PlantInUseException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while deleting the plant');
    }
  }
}