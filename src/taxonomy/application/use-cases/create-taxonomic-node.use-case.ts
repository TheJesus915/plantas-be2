import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITaxonomyRepository } from '../../domain/interfaces/taxonomy-repository.interface';
import { CreateTaxonomicNodeDto } from '../dtos/create-taxonomic-node.dto';
import { TaxonomicNode, TaxonomicRank, TAXONOMIC_RANK_ORDER } from '../../domain/entities/taxonomic-node.entity';

@Injectable()
export class CreateTaxonomicNodeUseCase {
  constructor(
    @Inject('ITaxonomyRepository')
    private readonly taxonomyRepository: ITaxonomyRepository
  ) {}

  async execute(dto: CreateTaxonomicNodeDto): Promise<{ id: string }> {
    const exists = await this.taxonomyRepository.existsNodeWithName(
      dto.name,
      dto.rank,
      dto.parentId,
    );

    if (exists) {
      throw new ConflictException('A taxonomic node with this name already exists at this rank and parent');
    }

    if (dto.parentId) {
      const parentNode = await this.taxonomyRepository.findTaxonomicNodeById(dto.parentId);

      if (!parentNode) {
        throw new NotFoundException('Parent taxonomic node not found');
      }

      const parentRankIndex = TAXONOMIC_RANK_ORDER.indexOf(parentNode.rank);
      const currentRankIndex = TAXONOMIC_RANK_ORDER.indexOf(dto.rank);

      if (currentRankIndex <= parentRankIndex) {
        throw new BadRequestException('The taxonomic rank must be lower than the parent rank');
      }
    } else {
      if (dto.rank !== TaxonomicRank.DOMAIN && dto.rank !== TaxonomicRank.KINGDOM) {
        throw new BadRequestException('Only DOMAIN and KINGDOM can be top-level taxonomic nodes');
      }
    }

    const newNode = new TaxonomicNode({
      name: dto.name,
      rank: dto.rank,
      parentId: dto.parentId,
    });

    const createdNode = await this.taxonomyRepository.createTaxonomicNode(newNode);

    return { id: createdNode.id };
  }
}