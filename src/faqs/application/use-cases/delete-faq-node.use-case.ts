import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IFaqsRepository } from '../../domain/interfaces/faqs-repository.interface';

@Injectable()
export class DeleteFaqNodeUseCase {
  constructor(
    @Inject('IFaqNodeRepository')
    private readonly faqsRepository: IFaqsRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existingNode = await this.faqsRepository.findFaqNodeById(id);
    if (!existingNode) {
      throw new NotFoundException('FaqNode not found');
    }

    await this.faqsRepository.deleteFaqNode(id);
  }
}
