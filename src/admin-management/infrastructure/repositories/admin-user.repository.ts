import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { IAdminUserRepository } from '../../domain/interfaces/admin-user-repository.interface';
import { Role, User, UserProfile, Prisma, PermissionAction } from '@prisma/client';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { CreateUserData, AdminRoleData } from '../../domain/interfaces/admin-user-repository.interface';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';

@Injectable()
export class AdminUserRepository implements IAdminUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService
  ) {}

  async createUser(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async createProfile(data: {
    user_id: string;
    birthdate: Date;
    phone: string;
    profile_picture: string | null;
    country: string;
    province: string;
    city: string;
  }): Promise<UserProfile> {
    return this.prisma.userProfile.create({ data });
  }

  async createUserRole(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.create({
      data: { user_id: userId, role_id: roleId }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findProfileByUserId(userId: string): Promise<UserProfile | null> {
    return this.prisma.userProfile.findUnique({
      where: { user_id: userId }
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    return this.prisma.userProfile.update({
      where: { user_id: userId },
      data
    });
  }

  async findAllAdmins(filter: PaginationFilterDto & { roleId?: string }): Promise<{
    data: User[];
    totalItems: number;
  }> {
    const where: Prisma.UserWhereInput = {
      type: Role.admin,
      ...(filter.search && {
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { lastname: { contains: filter.search, mode: 'insensitive' } },
          { email: { contains: filter.search, mode: 'insensitive' } }
        ]
      })
    };

    if (filter.roleId) {
      where.user_roles = {
        some: {
          role_id: filter.roleId
        }
      };
    }

    const totalItems = await this.prisma.user.count({ where });
    const { skip, take } = this.paginationService.getPaginationParameters(filter);
    const orderBy = this.paginationService.buildOrderByClause(filter, 'name');

    const data = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy
    });

    return {
      data,
      totalItems
    };
  }

  async findUserRoles(userId: string): Promise<AdminRoleData[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { user_id: userId },
      include: {
        role: {
          include: {
            module_permissions: {
              include: {
                module: true
              }
            }
          }
        }
      }
    });

    return userRoles.map(ur => {
      const moduleMap = new Map<string, {
        id: string;
        name: string;
        actions: PermissionAction[];
      }>();

      ur.role.module_permissions.forEach(mp => {
        if (!moduleMap.has(mp.module_id)) {
          moduleMap.set(mp.module_id, {
            id: mp.module_id,
            name: mp.module.name,
            actions: []
          });
        }
        moduleMap.get(mp.module_id)!.actions.push(mp.permission);
      });

      return {
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description || undefined,
        modules: Array.from(moduleMap.values())
      };
    });
  }
}