import { Injectable, Inject, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IPlantImagesRepository } from '../../../domain/interfaces/plant-images-repository.interface';

@Injectable()
export class UpdatePlantImageFileUseCase {
  constructor(
    @Inject('IPlantImagesRepository')
    private readonly plantImagesRepository: IPlantImagesRepository,
  ) {}

  async execute(imageId: string, file: Express.Multer.File): Promise<{ id: string }> {
    try {
      if (!imageId || imageId.trim() === '') {
        throw new BadRequestException('Image ID is required');
      }

      if (!file) {
        throw new BadRequestException('File is required');
      }

      await this.plantImagesRepository.updateImageFile(imageId, file);

      return { id: imageId };
    } catch (error) {

      if (error.message === 'Image not found') {
        throw new NotFoundException(`Image with ID ${imageId} not found`);
      }

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while updating the image file');
    }
  }
}