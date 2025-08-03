import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { CreateFaqNodeDto } from '../dtos/create-faq-node.dto';
import { FaqNode } from '../../domain/entities/faq-node.entity';
import { IFaqsRepository } from '../../domain/interfaces/faqs-repository.interface';

@Injectable()
export class CreateFaqNodeUseCase {
  constructor(
    @Inject('IFaqNodeRepository')
    private readonly faqsRepository: IFaqsRepository,
  ) {}

  async execute(dto: CreateFaqNodeDto): Promise<{ id: string }> {
    if (!dto.parentId) {
      const existsMain = await this.faqsRepository.existsNodeWithNoParent();
      if (existsMain) {
        throw new ConflictException('A main FAQ node already exists');
      }
    }

    const exists = await this.faqsRepository.existsNodeWithContent(
      dto.content,
      dto.type,
    );

    if (exists) {
      throw new ConflictException('A FAQ node with this content already exists');
    }

    const faqNode = new FaqNode({
      content: dto.content,
      type: dto.type,
      parentId: dto.parentId,
      createdAt: new Date(),
    });

    const createdNode = await this.faqsRepository.createFaqNode(faqNode);

    return {
      id: createdNode.id,
    };
  }
}
