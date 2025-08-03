import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { RoleRepositoryInterface } from '../../domain/interfaces/role.repository.interface';
import { Role } from '../../domain/entities/role.entity';
import { RoleMapper } from '../mappers/role.mapper';
import { PermissionAction } from '@prisma/client';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';

@Injectable()
export class RoleRepository implements RoleRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleMapper: RoleMapper,
    private readonly paginationService: PaginationService
  ) {}

  async create(
    roleData: Partial<Role>,
    permissions: Array<{ module_id: string; permissions: string[] }>
  ): Promise<Role> {
    const createdRole = await this.prisma.systemRole.create({
      data: {
        name: roleData.name!,
        description: roleData.description,
        is_active: roleData.is_active ?? true,
        module_permissions: {
          create: permissions.flatMap(p =>
            p.permissions.map(permission => ({
              module_id: p.module_id,
              permission: permission as PermissionAction
            }))
          )
        }
      },
      include: {
        module_permissions: {
          include: {
            module: true
          }
        },
        _count: {
          select: {
            user_roles: true
          }
        }
      }
    });

    return this.roleMapper.toDomainEntity(createdRole);
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.systemRole.findUnique({
      where: { id },
      include: {
        module_permissions: {
          include: {
            module: true
          }
        },
        _count: {
          select: {
            user_roles: true
          }
        }
      }
    });

    return role ? this.roleMapper.toDomainEntity(role) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.prisma.systemRole.findUnique({
      where: { name },
      include: {
        module_permissions: {
          include: {
            module: true
          }
        },
        _count: {
          select: {
            user_roles: true
          }
        }
      }
    });

    return role ? this.roleMapper.toDomainEntity(role) : null;
  }

  async findAll(isActive?: boolean): Promise<{ roles: Role[]; total: number }> {
    const where = isActive !== undefined ? { is_active: isActive } : {};

    const [roles, total] = await Promise.all([
      this.prisma.systemRole.findMany({
        where,
        include: {
          module_permissions: {
            include: {
              module: true,
            },
          },
          _count: {
            select: {
              user_roles: true,
            },
          },
        },
      }),
      this.prisma.systemRole.count({ where }),
    ]);

    return {
      roles: roles.map(role => this.roleMapper.toDomainEntity(role)),
      total,
    };
  }

  async findAllPaginated(
    filter: PaginationFilterDto,
    isActive?: boolean
  ): Promise<{ roles: Role[]; total: number }> {
    let where: any = isActive !== undefined ? { is_active: isActive } : {};

    if (filter.search) {
      where = {
        ...where,
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ],
      };
    }

    const total = await this.prisma.systemRole.count({ where });

    const { skip, take } = this.paginationService.getPaginationParameters(filter);

    const orderBy = this.paginationService.buildOrderByClause(filter, 'created_date');

    const rolesData = await this.prisma.systemRole.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        module_permissions: {
          include: {
            module: true
          }
        },
        _count: {
          select: {
            user_roles: true
          }
        }
      }
    });

    return {
      roles: rolesData.map(role => this.roleMapper.toDomainEntity(role)),
      total
    };
  }

  async update(
    id: string,
    data: Partial<Role>,
    permissions?: Array<{ module_id: string; permissions: string[] }>
  ): Promise<Role> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    const updatedRole = await this.prisma.$transaction(async (tx) => {
      const role = await tx.systemRole.update({
        where: { id },
        data: updateData
      });

      if (permissions) {
        await tx.modulePermission.deleteMany({
          where: { role_id: id }
        });

        await tx.modulePermission.createMany({
          data: permissions.flatMap(p =>
            p.permissions.map(permission => ({
              role_id: id,
              module_id: p.module_id,
              permission: permission as PermissionAction
            }))
          )
        });
      }

      return await tx.systemRole.findUnique({
        where: { id },
        include: {
          module_permissions: {
            include: {
              module: true
            }
          },
          _count: {
            select: {
              user_roles: true
            }
          }
        }
      });
    });

    return this.roleMapper.toDomainEntity(updatedRole!);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.modulePermission.deleteMany({
        where: { role_id: id }
      });

      await tx.systemRole.delete({
        where: { id }
      });
    });
  }

  async getUserCountByRole(roleId: string): Promise<number> {
    return await this.prisma.userRole.count({
      where: { role_id: roleId }
    });
  }

  async checkRoleExists(name: string, excludeId?: string): Promise<boolean> {
    const where: any = { name };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await this.prisma.systemRole.count({ where });
    return count > 0;
  }
}