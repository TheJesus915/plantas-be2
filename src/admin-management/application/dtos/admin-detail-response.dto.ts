import { Expose, Transform } from 'class-transformer';
import { PermissionAction } from '@prisma/client';

export class AdminModuleActionDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  actions: PermissionAction[];
}

export class AdminRoleDetailDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  modules: AdminModuleActionDto[];
}

export class AdminProfileDetailDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ value }) => value ? value.toISOString().split('T')[0] : null)
  birthdate: string;

  @Expose()
  phone: string;

  @Expose()
  profile_picture?: string;
}

export class AdminDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  lastname: string;

  @Expose()
  email: string;

  @Expose()
  type: string;

  @Expose()
  status: string;

  @Expose()
  registration_date: Date;

  @Expose()
  profile?: AdminProfileDetailDto;

  @Expose()
  roles: AdminRoleDetailDto[];
}