import { Injectable, Inject, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { UpdateAdminProfileDto } from '../dtos/update-admin-profile.dto';
import { IAdminUserRepository } from '../../domain/interfaces/admin-user-repository.interface';
import { AdminUserMapper } from '../../infrastructure/mappers/admin-user.mapper';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';

interface UpdateAdminResponse {
  id: string;
}

@Injectable()
export class UpdateAdminProfileUseCase {
  constructor(
    @Inject('IAdminUserRepository')
    private readonly adminUserRepository: IAdminUserRepository,
    private readonly adminMapper: AdminUserMapper,
    private readonly prisma: PrismaService
  ) {}

  async execute(id: string, dto: UpdateAdminProfileDto): Promise<UpdateAdminResponse> {
    try {
      const existingUser = await this.adminUserRepository.findById(id);
      if (!existingUser) {
        throw new NotFoundException('Admin user not found');
      }

      if (dto.email && dto.email !== existingUser.email) {
        const emailExists = await this.adminUserRepository.findByEmail(dto.email);
        if (emailExists) {
          throw new ConflictException('Email already registered');
        }
      }

      const userData = {
        ...(dto.name && { name: dto.name }),
        ...(dto.lastname && { lastname: dto.lastname }),
        ...(dto.email && { email: dto.email }),
        ...(dto.status_account && { status_account: dto.status_account })
      };

      if (Object.keys(userData).length > 0) {
        await this.adminUserRepository.updateUser(id, userData);
      }

      const profileData = {
        ...(dto.birthdate && { birthdate: new Date(dto.birthdate) }),
        ...(dto.phone && { phone: dto.phone })
      };

      if (Object.keys(profileData).length > 0) {
        await this.adminUserRepository.updateProfile(id, profileData);
      }

      if (dto.role_id) {
        const roleExists = await this.prisma.systemRole.findUnique({
          where: { id: dto.role_id }
        });

        if (!roleExists) {
          throw new NotFoundException(`Role with ID ${dto.role_id} not found`);
        }

        await this.prisma.$transaction(async (tx) => {
          await tx.userRole.deleteMany({
            where: { user_id: id }
          });

          await tx.userRole.create({
            data: {
              user_id: id,
              role_id: dto.role_id as string
            }
          });
        });
      }

      return { id };

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to update admin profile');
    }
  }
}