import { Injectable, Inject, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/services/prisma.service';
import { ICatalogPlantRepository } from '../../../domain/interfaces/catalog-plant-repository.interface';
import { IPlantImagesRepository } from '../../../domain/interfaces/plant-images-repository.interface';
import { CreateCatalogPlantDto } from '../../dtos/catalog-plant/create-catalog-plant-dto';

@Injectable()
export class CreateCatalogPlantUseCase {
  constructor(
    @Inject('ICatalogPlantRepository')
    private readonly catalogPlantRepository: ICatalogPlantRepository,

    @Inject('IPlantImagesRepository')
    private readonly plantImagesRepository: IPlantImagesRepository,

    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: CreateCatalogPlantDto): Promise<{ id: string }> {
    try {
      const existingPlant = await this.catalogPlantRepository.findByName(dto.name);
      if (existingPlant) {
        throw new ConflictException(`Plant with name ${dto.name} already exists`);
      }

      const taxonomicNode = await this.prisma.taxonomicNode.findUnique({
        where: { id: dto.taxonomicNodeId }
      });

      if (!taxonomicNode) {
        throw new NotFoundException(`Taxonomic node with ID ${dto.taxonomicNodeId} not found`);
      }

      if (taxonomicNode.rank !== 'SPECIES') {
        throw new BadRequestException(`Taxonomic node must be of rank SPECIES. Current rank: ${taxonomicNode.rank}`);
      }

      const plantWithSameNode = await this.prisma.catalogplant.findFirst({
        where: { taxonomicNodeId: dto.taxonomicNodeId }
      });

      if (plantWithSameNode) {
        throw new ConflictException(`A plant with this taxonomic node already exists: "${plantWithSameNode.name}"`);
      }

      const result = await this.prisma.$transaction(async (tx) => {
        const plantData = {
          name: dto.name,
          description: dto.description,
          planttype: dto.planttype,
          mintemp: dto.mintemp,
          maxtemp: dto.maxtemp,
          minhum: dto.minhum,
          maxhum: dto.maxhum,
          WARNINGS: dto.WARNINGS,
          taxonomicNodeId: dto.taxonomicNodeId
        };

        const plant = await tx.catalogplant.create({
          data: plantData,
        });

        if (dto.imageUrls && dto.imageUrls.length > 0) {
          const imageEntries = dto.imageUrls.map(url => ({
            catalog_id: plant.id,
            image_url: url,
          }));

          await tx.plantimages.createMany({
            data: imageEntries,
          });
        }

        return plant;
      });

      return { id: result.id };
    } catch (error) {

      if (error instanceof ConflictException || error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while creating the plant');
    }
  }
}