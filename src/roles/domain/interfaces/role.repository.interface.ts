import { Role } from '../entities/role.entity';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

export interface RoleRepositoryInterface {
  create(role: Partial<Role>, permissions: Array<{ module_id: string; permissions: string[] }>): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(isActive?: boolean): Promise<{ roles: Role[]; total: number }>;
  findAllPaginated(filter: PaginationFilterDto, isActive?: boolean): Promise<{ roles: Role[]; total: number }>;
  update(id: string, data: Partial<Role>, permissions?: Array<{ module_id: string; permissions: string[] }>): Promise<Role>;
  delete(id: string): Promise<void>;
  getUserCountByRole(roleId: string): Promise<number>;
  checkRoleExists(name: string, excludeId?: string): Promise<boolean>;
}