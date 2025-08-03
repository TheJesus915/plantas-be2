import { Injectable } from '@nestjs/common';
import { PlantImagesService } from '../../../infrastructure/services/plant-images.service';
import { UploadPlantImagesResponseDto } from '../../dtos/plant-images/upload-plant-images-response.dto';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
}

@Injectable()
export class UploadPlantImagesUseCase {
  constructor(private readonly plantImagesService: PlantImagesService) {}

  async execute(files: MulterFile[]): Promise<UploadPlantImagesResponseDto> {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    if (files.length > 5) {
      throw new Error('Maximum 5 images allowed');
    }

    const uploadedUrls = await this.plantImagesService.uploadImages(files);

    return {
      urls: uploadedUrls,
      message: 'Images uploaded successfully',
    };
  }
}