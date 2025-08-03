import { Injectable } from '@nestjs/common';
import { StorageService } from '../../../shared/infrastructure/services/storage.service';
import { PlantImagesRepository } from '../repositories/plant-images.repository';

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
export class PlantImagesService {
  constructor(
    private readonly storageService: StorageService,
    private readonly plantImagesRepository: PlantImagesRepository
  ) {}


  async uploadImages(files: MulterFile[]): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        throw new Error(`File ${file.originalname} is not an image`);
      }

      const ext = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = `plants/${fileName}`;

      const result = await this.storageService.uploadFile(
        filePath,
        file.buffer,
        file.mimetype
      );

      uploadedUrls.push(result.url);
    }

    return uploadedUrls;
  }


  async linkImagesToCatalogPlant(catalogId: string, imageUrls: string[]): Promise<number> {
    const imagesToCreate = imageUrls.map(url => ({
      catalog_id: catalogId,
      image_url: url
    }));

    const result = await this.plantImagesRepository.createMany(imagesToCreate);
    return result.count;
  }


  async deleteImage(imageId: string): Promise<void> {
    const image = await this.plantImagesRepository.findById(imageId);
    if (!image) {
      throw new Error(`Image with ID ${imageId} not found`);
    }

    try {
      const url = new URL(image.image_url);
      const pathname = url.pathname;
      const filePath = pathname.split('/').slice(2).join('/');

      await this.storageService.deleteFile(filePath);
    } catch (error) {
      console.error(`Failed to delete image from storage: ${error.message}`);
    }
    await this.plantImagesRepository.delete(imageId);
  }
}