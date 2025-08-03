import { Injectable } from '@nestjs/common';
import { FaqImagesService } from '../../infrastructure/services/faq-images.service';

@Injectable()
export class DeleteFaqImageUseCase {
  constructor(private readonly faqImagesService: FaqImagesService) {}

  async execute(url: string): Promise<boolean> {
    return this.faqImagesService.deleteImage(url);
  }
}
