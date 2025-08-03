import { IsString, IsNotEmpty, IsOptional, Length, Matches, IsArray, IsUUID, IsEnum } from 'class-validator';
import { PermissionAction } from '@prisma/client';

export class CreateRoleDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  @Matches(/^[a-zA-Z0-9\s_-]+$/, {
    message: 'Name can only contain letters, numbers, spaces, hyphens and underscores'
  })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(0, 500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Permissions must be an array' })
  permissions?: ModulePermissionDto[];
}

export class ModulePermissionDto {
  @IsUUID('4', { message: 'Module ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Module ID is required' })
  module_id: string;

  @IsArray({ message: 'Permissions must be an array' })
  @IsEnum(PermissionAction, { each: true, message: 'Each permission must be CREATE, READ, UPDATE, or DELETE' })
  permissions: PermissionAction[];
}