import { Injectable } from '@nestjs/common';
import { StorageService } from '../../../shared/infrastructure/services/storage.service';

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
export class FaqImagesService {
  constructor(private readonly storageService: StorageService) {}

  async uploadImages(files: MulterFile[]): Promise<string[]> {
    const uploadedUrls: string[] = [];
    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        throw new Error(`File ${file.originalname} is not an image`);
      }
      const ext = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = `faqs/${fileName}`;
      const result = await this.storageService.uploadFile(
        filePath,
        file.buffer,
        file.mimetype
      );
      uploadedUrls.push(result.url);
    }
    return uploadedUrls;
  }

  async deleteImage(url: string): Promise<boolean> {
    // Extraer el filePath de la URL pública
    const matches = url.match(/faqs\/[^?]+/);
    if (!matches) throw new Error('Invalid image URL');
    const filePath = matches[0];
    const { error } = await this.storageService['supabase'].storage
      .from(this.storageService['defaultBucket'])
      .remove([filePath]);
    if (error) throw new Error('Failed to delete image');
    return true;
  }
}
