import { Inject, Injectable } from '@nestjs/common';
import { GetFaqNodesQueryDto } from '../dtos/get-faq-nodes-query.dto';
import { FaqNode } from '../../domain/entities/faq-node.entity';
import { IFaqsRepository } from '../../domain/interfaces/faqs-repository.interface';
import { PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';

@Injectable()
export class GetFaqNodesUseCase {
  constructor(
    @Inject('IFaqNodeRepository')
    private readonly faqsRepository: IFaqsRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async execute(query: GetFaqNodesQueryDto): Promise<PaginatedResponseDto<FaqNode>> {
    const parentId = query.parentId !== undefined ? query.parentId : undefined;

    const { nodes, total } = await this.faqsRepository.findFaqNodesWithPagination(
      query,
      undefined,
      parentId,
      true,
    );

    return this.paginationService.paginate<FaqNode>(nodes, total, query);
  }
}
