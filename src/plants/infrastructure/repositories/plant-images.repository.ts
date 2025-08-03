import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { StorageService } from '../../../shared/infrastructure/services/storage.service';
import { IPlantImagesRepository } from '../../domain/interfaces/plant-images-repository.interface';
import { plantimages } from '@prisma/client';

@Injectable()
export class PlantImagesRepository implements IPlantImagesRepository {
  private readonly folder = 'plants';

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService
  ) {}

  async create(imageData: Omit<plantimages, 'id' | 'created_at'>): Promise<plantimages> {
    return this.prisma.plantimages.create({
      data: imageData,
    });
  }

  async createMany(imagesData: Omit<plantimages, 'id' | 'created_at'>[]): Promise<{ count: number }> {
    return this.prisma.plantimages.createMany({
      data: imagesData,
    });
  }

  async findById(id: string): Promise<plantimages | null> {
    return this.prisma.plantimages.findUnique({
      where: { id },
    });
  }

  async findByCatalogId(catalogId: string): Promise<plantimages[]> {
    return this.prisma.plantimages.findMany({
      where: { catalog_id: catalogId },
    });
  }

  async delete(id: string): Promise<plantimages> {
    const image = await this.findById(id);
    if (image) {
      try {
        const urlObj = new URL(image.image_url);
        const pathParts = urlObj.pathname.split('/public/')[1].split('/');
        const bucket = pathParts[0];
        const filePath = pathParts.slice(1).join('/');

        await this.storageService.deleteFile(filePath, bucket);
      } catch (error) {
        console.error('Error deleting file from storage:', error);
      }
    }

    return this.prisma.plantimages.delete({
      where: { id },
    });
  }

  async uploadAndCreate(file: Express.Multer.File, catalogId: string): Promise<{ imageUrl: string, imageData: plantimages }> {
    const timestamp = Date.now();
    const fileExt = file.originalname.split('.').pop();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${random}.${fileExt}`;
    const filePath = `${this.folder}/${fileName}`;
    const { url } = await this.storageService.uploadFile(
      filePath,
      file.buffer,
      file.mimetype
    );
    const imageData = await this.create({
      catalog_id: catalogId,
      image_url: url,
    });

    return {
      imageUrl: url,
      imageData
    };
  }

  async updateImageFile(imageId: string, file: Express.Multer.File): Promise<plantimages> {
    const image = await this.findById(imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    const urlObj = new URL(image.image_url);
    const pathParts = urlObj.pathname.split('/public/')[1].split('/');
    const bucket = pathParts[0];
    const filePath = pathParts.slice(1).join('/');
    await this.storageService.uploadFile(
      filePath,
      file.buffer,
      file.mimetype,
      bucket
    );
    return image;
  }
}