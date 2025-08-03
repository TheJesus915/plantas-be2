import { IsString, IsOptional, Length, Matches, IsArray, IsBoolean, IsUUID, IsEnum } from 'class-validator';
import { PermissionAction } from '@prisma/client';

export class ModulePermissionDto {
  @IsUUID('4', { message: 'Module ID must be a valid UUID' })
  module_id: string;

  @IsArray({ message: 'Permissions must be an array' })
  @IsEnum(PermissionAction, { each: true, message: 'Each permission must be CREATE, READ, UPDATE, or DELETE' })
  permissions: PermissionAction[];
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  @Matches(/^[a-zA-Z0-9\s_-]+$/, {
    message: 'Name can only contain letters, numbers, spaces, hyphens and underscores'
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(0, 500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Is active must be a boolean value' })
  is_active?: boolean;

  @IsOptional()
  @IsArray({ message: 'Permissions must be an array' })
  permissions?: ModulePermissionDto[];
}