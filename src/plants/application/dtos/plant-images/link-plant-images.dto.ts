import { IsUUID, IsNotEmpty } from 'class-validator';

export class LinkPlantImageDto {
  @IsUUID(4, { message: 'Catalog plant ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Catalog plant ID is required' })
  catalogPlantId: string;
}