import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaxonomicRank } from '../../domain/entities/taxonomic-node.entity';

export class CreateTaxonomicNodeDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'Taxonomic rank is required' })
  @IsEnum(TaxonomicRank, { message: 'Invalid taxonomic rank' })
  rank: TaxonomicRank;

  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  parentId?: string;
}
