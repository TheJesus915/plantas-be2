import { PermissionAction } from '@prisma/client';

export class RoleResponseDto {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_date: Date;
  permissions: ModulePermissionResponseDto[];
  user_count?: number;
}

export class ModulePermissionResponseDto {
  module_id: string;
  module_name: string;
  permissions: PermissionAction[];
}
