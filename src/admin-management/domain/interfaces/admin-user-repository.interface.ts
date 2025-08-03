import { Role, StatusAccount, PermissionAction } from '@prisma/client';
import { User, UserProfile } from '@prisma/client';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

export interface AdminModuleData {
  id: string;
  name: string;
  actions: PermissionAction[];
}

export interface AdminRoleData {
  id: string;
  name: string;
  description?: string;
  modules: AdminModuleData[];
}

export interface CreateUserData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  type: Role;
  status_account: StatusAccount;
  token_recovery: string | null;
  token_exp: Date | null;
  reset_token: string | null;
  reset_token_exp: Date | null;
}


export interface IAdminUserRepository {
  createUser(data: CreateUserData): Promise<User>;

  createProfile(data: {
    user_id: string;
    birthdate: Date;
    phone: string;
    profile_picture: string | null;
    country: string;
    province: string;
    city: string;
  }): Promise<UserProfile>;

  createUserRole(userId: string, roleId: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findProfileByUserId(userId: string): Promise<UserProfile | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile>;

  findAllAdmins(filter: PaginationFilterDto & { roleId?: string }): Promise<{
    data: User[];
    totalItems: number;
  }>;

  findUserRoles(userId: string): Promise<AdminRoleData[]>;
}