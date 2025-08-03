import { UserGeneralEntity } from '../entities/user-general.entity';
import { PaginationFilterDto, PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';

export interface IUserGeneralRepository {
  findAllGeneralUsers(filter: PaginationFilterDto): Promise<PaginatedResponseDto<UserGeneralEntity>>;
  findGeneralUserById(id: string): Promise<UserGeneralEntity | null>;
  updateStatusAccount(id: string, status: string): Promise<{ id: string }>;
}
