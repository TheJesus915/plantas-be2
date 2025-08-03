import { Injectable } from '@nestjs/common';
import { SystemRole, ModulePermission, Module, PermissionAction } from '@prisma/client';
import { Role, RolePermission } from '../../domain/entities/role.entity';
import { RoleResponseDto } from '../../application/dtos/role-response.dto';
import { RoleBasicResponseDto } from '../../application/dtos/role-basic-response.dto'

type SystemRoleWithRelations = SystemRole & {
  module_permissions: (ModulePermission & {
    module: Module;
  })[];
  _count?: {
    user_roles: number;
  };
};

@Injectable()
export class RoleMapper {
  toDomainEntity(prismaRole: SystemRoleWithRelations): Role {
    const permissions = this.groupPermissionsByModule(prismaRole.module_permissions);
    return new Role(
      prismaRole.id,
      prismaRole.name,
      prismaRole.description,
      prismaRole.is_active,
      prismaRole.created_date,
      permissions,
      prismaRole._count?.user_roles ?? 0
    );
  }

  toBasicResponseDto(domainRole: Role): RoleBasicResponseDto {
    return {
      id: domainRole.id,
      name: domainRole.name,
      description: domainRole.description || null,
      is_active: domainRole.is_active
    };
  }

  toResponseDto(domainRole: Role): RoleResponseDto {
    return {
      id: domainRole.id,
      name: domainRole.name,
      description: domainRole.description || undefined,
      is_active: domainRole.is_active,
      created_date: domainRole.createdDate,
      permissions: domainRole.permissions.map(permission => ({
        module_id: permission.moduleId,
        module_name: permission.moduleName,
        permissions: permission.permissions as PermissionAction[]
      })),
      user_count: domainRole.userCount
    };
  }

  private groupPermissionsByModule(modulePermissions: (ModulePermission & { module: Module })[]): RolePermission[] {
    const groupedPermissions = new Map<string, { moduleName: string; permissions: string[] }>();

    modulePermissions.forEach(mp => {
      const key = mp.module_id;
      if (!groupedPermissions.has(key)) {
        groupedPermissions.set(key, {
          moduleName: mp.module.name,
          permissions: []
        });
      }
      groupedPermissions.get(key)!.permissions.push(mp.permission);
    });

    return Array.from(groupedPermissions.entries()).map(([moduleId, data]) =>
      new RolePermission(moduleId, data.moduleName, data.permissions)
    );
  }
}