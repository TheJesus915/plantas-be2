import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    name: string;
    type: string;
    email: string;
    status: string;
    iat?: number;
    exp?: number;
  }
}

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    if (user.type !== Role.superadmin) {
      throw new ForbiddenException({
        message: 'Access denied. Only superadmins can perform this action',
        statusCode: 403,
        error: 'Forbidden'
      });
    }

    return true;
  }
}