import { Injectable } from '@nestjs/common';
import { User, UserProfile, Role, StatusAccount } from '@prisma/client';
import { AdminUser } from '../../domain/entities/admin-user.entity';
import { AdminProfile } from '../../domain/entities/admin-profile.entity';
import { CreateUserData } from '../../domain/interfaces/admin-user-repository.interface';
import { AdminListItemDto } from '../../application/dtos/admin-list-response.dto';
import { AdminDetailResponseDto } from '../../application/dtos/admin-detail-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AdminUserMapper {
  toDomain(user: User): AdminUser {
    return new AdminUser({
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      type: user.type,
      status_account: user.status_account
    });
  }

  toDomainProfile(profile: UserProfile): AdminProfile {
    return new AdminProfile({
      id: profile.id,
      user_id: profile.user_id,
      birthdate: profile.birthdate,
      phone: profile.phone,
      profile_picture: profile.profile_picture
    });
  }

  toCreateUserData(hashedPassword: string, dto: {
    name: string;
    lastname: string;
    email: string;
  }): CreateUserData {
    return {
      name: dto.name,
      lastname: dto.lastname,
      email: dto.email,
      password: hashedPassword,
      type: Role.admin,
      status_account: StatusAccount.Active,
      token_recovery: null,
      token_exp: null,
      reset_token: null,
      reset_token_exp: null
    };
  }

  toListItem(admin: AdminUser, roleName: string): AdminListItemDto {
    return plainToInstance(AdminListItemDto, {
      id: admin.id,
      name: admin.name,
      lastname: admin.lastname,
      email: admin.email,
      status: admin.status_account,
      role: roleName
    }, { excludeExtraneousValues: true });
  }

  toDetailResponse(admin: AdminUser, profile: AdminProfile | null, roles: {
    id: string;
    name: string;
    description?: string;
    modules: {
      id: string;
      name: string;
      actions: string[];
    }[];
  }[]): AdminDetailResponseDto {
    return plainToInstance(AdminDetailResponseDto, {
      id: admin.id,
      name: admin.name,
      lastname: admin.lastname,
      email: admin.email,
      type: admin.type,
      status: admin.status_account,
      profile: profile ? {
        id: profile.id,
        birthdate: profile.birthdate.toISOString().split('T')[0],
        phone: profile.phone,
        profile_picture: profile.profile_picture || undefined
      } : undefined,
      roles: roles
    }, { excludeExtraneousValues: true });
  }
}