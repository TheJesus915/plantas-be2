import { Injectable, BadRequestException } from '@nestjs/common';
import { FaqImagesService } from '../../infrastructure/services/faq-images.service';

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
export class UploadFaqImageUseCase {
  constructor(private readonly faqImagesService: FaqImagesService) {}

  async execute(files: MulterFile[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided for upload');
    }

    if (files.length > 5) {
      throw new BadRequestException('You can upload a maximum of 5 images per request');
    }

    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException(`File ${file.originalname} is not a valid image`);
      }

      const maxSizeInBytes = 3 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        throw new BadRequestException(`Image ${file.originalname} exceeds the maximum allowed size of 5MB`);
      }
    }

    return this.faqImagesService.uploadImages(files);
  }
}
