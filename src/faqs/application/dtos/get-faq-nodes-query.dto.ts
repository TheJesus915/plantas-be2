import { IsOptional, IsString } from 'class-validator';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

export class GetFaqNodesQueryDto extends PaginationFilterDto {
  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  parentId?: string;
}
