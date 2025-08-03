import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateFaqNodeDto } from '../dtos/update-faq-node.dto';
import { IFaqsRepository } from '../../domain/interfaces/faqs-repository.interface';

@Injectable()
export class UpdateFaqNodeUseCase {
  constructor(
    @Inject('IFaqNodeRepository')
    private readonly faqsRepository: IFaqsRepository,
  ) {}

  async execute(id: string, dto: UpdateFaqNodeDto): Promise<{ id: string }> {
    const existingNode = await this.faqsRepository.findFaqNodeById(id);

    if (!existingNode) {
      throw new NotFoundException('FAQ node not found');
    }

    const updatedNode = await this.faqsRepository.updateFaqNode(id, {
      content: dto.content
    });

    return {
      id: updatedNode.id,
    };
  }
}
