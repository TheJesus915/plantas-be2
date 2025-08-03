import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ITaxonomyRepository } from '../../domain/interfaces/taxonomy-repository.interface';
import { GetTaxonomicNodesQueryDto } from '../dtos/get-taxonomic-nodes-query.dto';
import { TaxonomicNode, TaxonomicRank } from '../../domain/entities/taxonomic-node.entity';

@Injectable()
export class GetTaxonomicNodesUseCase {
  constructor(
    @Inject('ITaxonomyRepository')
    private readonly taxonomyRepository: ITaxonomyRepository,
  ) {}

  async execute(query: GetTaxonomicNodesQueryDto): Promise<TaxonomicNode[]> {
    if (query.rank && query.parentId) {
      return this.taxonomyRepository.findTaxonomicNodesByRankAndParentId(
        query.rank,
        query.parentId,
      );
    }

    if (query.rank && !query.parentId) {
      return this.taxonomyRepository.findTaxonomicNodesByRank(query.rank);
    }

    if (!query.rank && query.parentId) {
      const parentExists = await this.taxonomyRepository.findTaxonomicNodeById(
        query.parentId,
      );

      if (!parentExists) {
        throw new NotFoundException('Parent taxonomic node not found');
      }

      return this.taxonomyRepository.findTaxonomicNodesByParentId(query.parentId);
    }
    return this.taxonomyRepository.findTaxonomicNodesByRank(TaxonomicRank.DOMAIN);
  }
}
