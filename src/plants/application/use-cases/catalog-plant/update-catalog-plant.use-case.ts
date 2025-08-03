import { Injectable, Inject, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { ICatalogPlantRepository } from '../../../domain/interfaces/catalog-plant-repository.interface';
import { UpdateCatalogPlantDto } from '../../dtos/catalog-plant/update-catalog-plant.dto';
import { PrismaService } from '../../../../shared/infrastructure/services/prisma.service';

@Injectable()
export class UpdateCatalogPlantUseCase {
  constructor(
    @Inject('ICatalogPlantRepository')
    private readonly catalogPlantRepository: ICatalogPlantRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: string, dto: UpdateCatalogPlantDto): Promise<{ id: string }> {
    try {
      const [existingPlant, plantWithSameName] = await Promise.all([
        this.catalogPlantRepository.findById(id),
        dto.name ? this.catalogPlantRepository.findByName(dto.name) : null
      ]);

      if (!existingPlant) {
        throw new NotFoundException(`Plant with ID ${id} not found`);
      }

      if ('images' in dto || 'plantimages' in dto) {
        throw new BadRequestException('Images cannot be updated through this endpoint. Please use the image management endpoints.');
      }

      if (dto.name && dto.name !== existingPlant.name && plantWithSameName && plantWithSameName.id !== id) {
        throw new ConflictException(`A plant with the name '${dto.name}' already exists`);
      }

      if (dto.taxonomicNodeId) {
        const taxonomicNode = await this.prisma.taxonomicNode.findUnique({
          where: { id: dto.taxonomicNodeId }
        });

        if (!taxonomicNode) {
          throw new NotFoundException(`Taxonomic node with ID ${dto.taxonomicNodeId} not found`);
        }

        if (taxonomicNode.rank !== 'SPECIES') {
          throw new BadRequestException(`Taxonomic node must be of rank SPECIES. Current rank: ${taxonomicNode.rank}`);
        }

        const taxonomyCheck = await this.catalogPlantRepository.checkPlantWithTaxonomicNode(
          dto.taxonomicNodeId,
          id
        );

        if (taxonomyCheck.exists) {
          throw new ConflictException(
            `This taxonomic node is already assigned to plant '${taxonomyCheck.plantName}'`
          );
        }
      }

      await this.catalogPlantRepository.update(id, dto);


      return { id };
    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while updating the plant');
    }
  }
}