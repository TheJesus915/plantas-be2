import { ModuleEntity } from '../entities/module.entity';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

export interface IModuleRepository {
  create(moduleData: Omit<ModuleEntity, 'id' | 'createdDate'>): Promise<ModuleEntity>;
  findAll(includeInactive?: boolean): Promise<ModuleEntity[]>;
  findAllPaginated(filter: PaginationFilterDto, includeInactive?: boolean): Promise<{
    data: ModuleEntity[];
    totalItems: number;
  }>;
  findById(id: string): Promise<ModuleEntity | null>;
  findByName(name: string): Promise<ModuleEntity | null>;
  update(id: string, moduleData: Partial<ModuleEntity>): Promise<ModuleEntity>;
  delete(id: string): Promise<void>;
  exists(name: string, excludeId?: string): Promise<boolean>;
}