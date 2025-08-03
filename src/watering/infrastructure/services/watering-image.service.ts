import { Injectable } from '@nestjs/common';
import { StorageService } from '../../../shared/infrastructure/services/storage.service';

export interface MulterFile {
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
export class WateringImageService {
  private readonly folderPath = 'watering';

  constructor(private readonly storageService: StorageService) {}

  async uploadImage(file: MulterFile, subFolder: string): Promise<string> {
    if (!file.mimetype.startsWith('image/')) {
      throw new Error(`the file ${file.originalname} does not have a valid image format`);
    }

    const ext = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `${this.folderPath}/${subFolder}/${fileName}`;

    const result = await this.storageService.uploadFile(
      filePath,
      file.buffer,
      file.mimetype
    );

    return result.url;
  }

  async updateImage(currentImageUrl: string, newFile: MulterFile, subFolder: string): Promise<string> {
    try {
      const url = new URL(currentImageUrl);
      const pathname = url.pathname;
      const pathParts = pathname.split('/public/');

      if (pathParts.length !== 2) {
        return this.uploadImage(newFile, subFolder);
      }

      const pathSegments = pathParts[1].split('/');
      const bucket = pathSegments[0];
      const filePath = pathSegments.slice(1).join('/');

      await this.storageService.uploadFile(
        filePath,
        newFile.buffer,
        newFile.mimetype,
        bucket
      );

      return currentImageUrl;
    } catch (error) {
      return this.uploadImage(newFile, subFolder);
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const url = new URL(imageUrl);
      const pathname = url.pathname;
      const pathParts = pathname.split('/public/');

      if (pathParts.length !== 2) {
        return;
      }

      const pathSegments = pathParts[1].split('/');
      const bucket = pathSegments[0];
      const filePath = pathSegments.slice(1).join('/');

      await this.storageService.deleteFile(filePath, bucket);
    } catch (error) {
    }
  }
}
