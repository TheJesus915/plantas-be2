import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITaxonomyRepository } from '../../domain/interfaces/taxonomy-repository.interface';
import { UpdateTaxonomicNodeDto } from '../dtos/update-taxonomic-node.dto';

@Injectable()
export class UpdateTaxonomicNodeUseCase {
  constructor(
    @Inject('ITaxonomyRepository')
    private readonly taxonomyRepository: ITaxonomyRepository
  ) {}

  async execute(id: string, dto: UpdateTaxonomicNodeDto): Promise<{ id: string }> {
    const node = await this.taxonomyRepository.findTaxonomicNodeById(id);

    if (!node) {
      throw new NotFoundException('Taxonomic node not found');
    }

    if (dto.name && dto.name !== node.name) {
      const exists = await this.taxonomyRepository.existsNodeWithName(
        dto.name,
        node.rank,
        node.parentId,
      );

      if (exists) {
        throw new ConflictException('A taxonomic node with this name already exists at this rank and parent');
      }
    }

    await this.taxonomyRepository.updateTaxonomicNode(id, dto);

    return { id };
  }
}
