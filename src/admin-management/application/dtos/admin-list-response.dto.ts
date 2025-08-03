import { Expose } from 'class-transformer';
import { PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';
import { StatusAccount } from '@prisma/client';

export class AdminListItemDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  lastname: string;

  @Expose()
  email: string;

  @Expose()
  status: StatusAccount;

  @Expose()
  role: string;
}

export class AdminListResponseDto extends PaginatedResponseDto<AdminListItemDto> {}