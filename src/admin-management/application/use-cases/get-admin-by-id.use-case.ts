import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAdminUserRepository } from '../../domain/interfaces/admin-user-repository.interface';
import { AdminUserMapper } from '../../infrastructure/mappers/admin-user.mapper';
import { AdminDetailResponseDto } from '../dtos/admin-detail-response.dto';

@Injectable()
export class GetAdminByIdUseCase {
  constructor(
    @Inject('IAdminUserRepository')
    private readonly adminUserRepository: IAdminUserRepository,
    private readonly adminMapper: AdminUserMapper
  ) {}

  async execute(id: string): Promise<AdminDetailResponseDto> {
    try {
      const user = await this.adminUserRepository.findById(id);
      if (!user) {
        throw new NotFoundException('Admin user not found');
      }

      const [profile, roles] = await Promise.all([
        this.adminUserRepository.findProfileByUserId(id),
        this.adminUserRepository.findUserRoles(id)
      ]);

      const adminEntity = this.adminMapper.toDomain(user);
      const profileEntity = profile ? this.adminMapper.toDomainProfile(profile) : null;

      return this.adminMapper.toDetailResponse(
        adminEntity,
        profileEntity,
        roles
      );

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Admin user not found');
    }
  }
}