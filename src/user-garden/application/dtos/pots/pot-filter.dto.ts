import { IsOptional, IsString, IsBoolean, Matches } from 'class-validator';
import { PaginationFilterDto } from '../../../../shared/application/dtos/pagination.dto';

export class PotFilterDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  areaId?: string;

  @IsOptional()
  @IsString({message: 'has_device must be a boolean'})
  @Matches(/^(true|false)$/, { message: 'has_device must be a boolean value (true or false)' })
  has_device?: string;
}