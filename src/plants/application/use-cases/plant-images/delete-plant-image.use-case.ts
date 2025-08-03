import { Injectable, Inject, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IPlantImagesRepository } from '../../../domain/interfaces/plant-images-repository.interface';
import { DeletePlantImageDto } from '../../dtos/plant-images/delete-plant-image.dto';

@Injectable()
export class DeletePlantImageUseCase {
  constructor(
    @Inject('IPlantImagesRepository')
    private readonly plantImagesRepository: IPlantImagesRepository
  ) {}

  async execute(dto: DeletePlantImageDto): Promise<void> {
    try {
      if (!dto.imageId || dto.imageId.trim() === '') {
        throw new BadRequestException('Image ID is required');
      }

      const existingImage = await this.plantImagesRepository.findById(dto.imageId);
      if (!existingImage) {
        throw new NotFoundException(`Image with ID ${dto.imageId} not found`);
      }

      await this.plantImagesRepository.delete(dto.imageId);
    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while deleting the image');
    }
  }
}