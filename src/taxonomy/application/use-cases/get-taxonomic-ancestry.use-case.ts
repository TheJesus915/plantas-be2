import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITaxonomyRepository } from '../../domain/interfaces/taxonomy-repository.interface';
import { TaxonomicNode } from '../../domain/entities/taxonomic-node.entity';

@Injectable()
export class GetTaxonomicAncestryUseCase {
  constructor(
    @Inject('ITaxonomyRepository')
    private readonly taxonomyRepository: ITaxonomyRepository
  ) {}

  async execute(nodeId: string): Promise<TaxonomicNode[]> {
    const node = await this.taxonomyRepository.findTaxonomicNodeById(nodeId);

    if (!node) {
      throw new NotFoundException('Taxonomic node not found');
    }
    return this.taxonomyRepository.getAncestry(nodeId);
  }
}
