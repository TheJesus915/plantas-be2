import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaxonomicRank } from '../../domain/entities/taxonomic-node.entity';

export class GetTaxonomicNodesQueryDto {
  @IsOptional()
  @IsEnum(TaxonomicRank, { message: 'Invalid taxonomic rank' })
  rank?: TaxonomicRank;

  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  parentId?: string;
}
