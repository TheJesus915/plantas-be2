import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../services/prisma.service';
import { PermissionAction } from '@prisma/client';
import { UnauthorizedAccessException } from '../../domain/exceptions/unauthorized-access.exception';

export const MODULE_KEY = 'module';
export const ACTION_KEY = 'action';

export const RequirePermission = (moduleName: string, action: PermissionAction) =>
  SetMetadata('permissions', { moduleName, action });

@Injectable()
export class ModulePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<{ moduleName: string; action: PermissionAction }>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const { moduleName, action } = requiredPermissions;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedAccessException('User not authenticated');
    }

    if (user.type === 'superadmin') {
      return true;
    }

    const userRoles = await this.prismaService.userRole.findMany({
      where: { user_id: user.id },
      include: { role: true },
    });

    for (const userRole of userRoles) {
      const hasPermission = await this.prismaService.modulePermission.findFirst({
        where: {
          role_id: userRole.role_id,
          module: { name: moduleName },
          permission: action,
        },
        include: { module: true },
      });

      if (hasPermission) {
        return true;
      }
    }

    throw new UnauthorizedAccessException(
      `User without permissions to ${this.mapActionToSpanish(action)} in the module ${moduleName}`
    );
  }

  private mapActionToSpanish(action: PermissionAction): string {
    const actionMap = {
      [PermissionAction.CREATE]: 'create',
      [PermissionAction.READ]: 'read',
      [PermissionAction.UPDATE]: 'update',
      [PermissionAction.DELETE]: 'delete',
    };

    return actionMap[action] || action;
  }
}