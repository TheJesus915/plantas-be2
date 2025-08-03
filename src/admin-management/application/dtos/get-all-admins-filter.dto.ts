import { IsOptional, IsString } from 'class-validator';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

export class GetAllAdminsFilterDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  roleId?: string;
}

