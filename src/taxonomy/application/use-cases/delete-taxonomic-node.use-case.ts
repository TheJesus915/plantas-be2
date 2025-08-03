import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITaxonomyRepository } from '../../domain/interfaces/taxonomy-repository.interface';

@Injectable()
export class DeleteTaxonomicNodeUseCase {
  constructor(
    @Inject('ITaxonomyRepository')
    private readonly taxonomyRepository: ITaxonomyRepository
  ) {}

  async execute(id: string): Promise<void> {
    const node = await this.taxonomyRepository.findTaxonomicNodeById(id);

    if (!node) {
      throw new NotFoundException('Taxonomic node not found');
    }

    const hasRelations = await this.taxonomyRepository.hasDescendantWithCatalogPlants(id);

    if (hasRelations) {
      throw new BadRequestException('Cannot delete a taxonomic node or its descendants that are being used by catalog plants');
    }

    await this.taxonomyRepository.deleteTaxonomicNode(id);
  }
}