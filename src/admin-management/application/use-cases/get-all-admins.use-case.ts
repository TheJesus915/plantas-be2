import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IAdminUserRepository } from '../../domain/interfaces/admin-user-repository.interface';
import { AdminUserMapper } from '../../infrastructure/mappers/admin-user.mapper';
import { AdminListResponseDto } from '../dtos/admin-list-response.dto';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';
import { GetAllAdminsFilterDto } from '../dtos/get-all-admins-filter.dto';

@Injectable()
export class GetAllAdminsUseCase {
  constructor(
    @Inject('IAdminUserRepository')
    private readonly adminUserRepository: IAdminUserRepository,
    private readonly adminMapper: AdminUserMapper,
    private readonly paginationService: PaginationService
  ) {}

  async execute(filter: GetAllAdminsFilterDto): Promise<AdminListResponseDto> {
    try {
      const { data, totalItems } = await this.adminUserRepository.findAllAdmins(filter);

      const adminEntities = data.map(user => this.adminMapper.toDomain(user));
      const roles = await Promise.all(
        data.map(user => this.adminUserRepository.findUserRoles(user.id))
      );

      const mappedData = adminEntities.map((admin, index) =>
        this.adminMapper.toListItem(admin, roles[index][0]?.name || 'No role assigned')
      );

      return this.paginationService.paginate(mappedData, totalItems, filter);
    } catch (error) {
      throw new BadRequestException('Failed to retrieve administrators');
    }
  }
}