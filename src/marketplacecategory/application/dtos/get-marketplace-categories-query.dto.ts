import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

export class GetMarketplaceCategoriesQueryDto extends PaginationFilterDto {
  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  @IsUUID(4, { message: 'Parent ID must be a valid UUID' })
  parent_id?: string;
}
