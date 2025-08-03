import { Injectable } from '@nestjs/common';
import { StorageService } from '../../../shared/infrastructure/services/storage.service';

@Injectable()
export class MarketplaceCategoryImageService {
  constructor(
    private readonly storageService: StorageService
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file.mimetype.startsWith('image/')) {
      throw new Error(`File ${file.originalname} is not an image`);
    }

    const ext = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `marketplace-categories/${fileName}`;

    const result = await this.storageService.uploadFile(
      filePath,
      file.buffer,
      file.mimetype
    );

    return result.url;
  }

  async updateExistingImage(existingUrl: string, file: Express.Multer.File): Promise<string> {
    if (!file.mimetype.startsWith('image/')) {
      throw new Error(`File ${file.originalname} is not an image`);
    }

    const urlParts = existingUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'marketplace-categories');

    if (bucketIndex === -1) {
      return await this.uploadImage(file);
    }

    const filePath = urlParts.slice(bucketIndex).join('/');

    const result = await this.storageService.uploadFile(
      filePath,
      file.buffer,
      file.mimetype
    );

    return result.url;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'marketplace-categories');

    if (bucketIndex === -1) {
      throw new Error('Invalid image URL format');
    }

    const filePath = urlParts.slice(bucketIndex).join('/');

    await this.storageService.deleteFile(filePath);
  }
}
