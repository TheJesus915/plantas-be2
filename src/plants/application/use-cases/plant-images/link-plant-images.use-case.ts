import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IPlantImagesRepository } from '../../../domain/interfaces/plant-images-repository.interface';
import { ICatalogPlantRepository } from '../../../domain/interfaces/catalog-plant-repository.interface';
import { LinkPlantImageDto } from '../../dtos/plant-images/link-plant-images.dto';

@Injectable()
export class LinkPlantImageUseCase {
  constructor(
    @Inject('IPlantImagesRepository')
    private readonly plantImagesRepository: IPlantImagesRepository,

    @Inject('ICatalogPlantRepository')
    private readonly catalogPlantRepository: ICatalogPlantRepository,
  ) {}

  async execute(dto: LinkPlantImageDto, file: Express.Multer.File): Promise<{ url: string; message: string }> {
    const { catalogPlantId } = dto;

    const plant = await this.catalogPlantRepository.findById(catalogPlantId);
    if (!plant) {
      throw new BadRequestException(`Plant with ID ${catalogPlantId} not found`);
    }

    const existingImages = await this.plantImagesRepository.findByCatalogId(catalogPlantId);
    if (existingImages.length >= 5) {
      throw new BadRequestException('This plant already has the maximum number of images (5)');
    }

    const { imageUrl } = await this.plantImagesRepository.uploadAndCreate(file, catalogPlantId);

    return {
      url: imageUrl,
      message: 'Image uploaded and linked to plant successfully',
    };
  }
}