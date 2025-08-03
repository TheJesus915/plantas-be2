import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { IModuleRepository } from '../../domain/interfaces/module.repository.interface';
import { ModuleEntity } from '../../domain/entities/module.entity';
import { ModuleMapper } from '../mappers/module.mapper';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';

@Injectable()
export class ModuleRepository implements IModuleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService
  ) {}

  async create(moduleData: Omit<ModuleEntity, 'id' | 'createdDate'>): Promise<ModuleEntity> {
    const createdModule = await this.prisma.module.create({
      data: {
        name: moduleData.name,
        description: moduleData.description,
        is_active: moduleData.isActive,
      },
    });

    return ModuleMapper.toDomain(createdModule);
  }

  async findAll(includeInactive: boolean = false): Promise<ModuleEntity[]> {
    const modules = await this.prisma.module.findMany({
      where: includeInactive ? {} : { is_active: true },
      orderBy: { created_date: 'desc' },
    });

    return modules.map(ModuleMapper.toDomain);
  }

  async findAllPaginated(
    filter: PaginationFilterDto,
    includeInactive: boolean = false,
  ): Promise<{ data: ModuleEntity[]; totalItems: number }> {
    let where: any = includeInactive ? {} : { is_active: true };

    if (filter.search) {
      where = {
        ...where,
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ],
      };
    }

    const totalItems = await this.prisma.module.count({ where });
    const { skip, take } = this.paginationService.getPaginationParameters(filter);
    const orderBy = this.paginationService.buildOrderByClause(filter, 'created_date');

    const modules = await this.prisma.module.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return {
      data: modules.map(ModuleMapper.toDomain),
      totalItems,
    };
  }

  async findById(id: string): Promise<ModuleEntity | null> {
    const module = await this.prisma.module.findUnique({
      where: { id },
    });

    return module ? ModuleMapper.toDomain(module) : null;
  }

  async findByName(name: string): Promise<ModuleEntity | null> {
    const module = await this.prisma.module.findUnique({
      where: { name: name.toLowerCase() },
    });

    return module ? ModuleMapper.toDomain(module) : null;
  }

  async update(id: string, moduleData: Partial<ModuleEntity>): Promise<ModuleEntity> {
    const updatedModule = await this.prisma.module.update({
      where: { id },
      data: {
        ...(moduleData.name && { name: moduleData.name }),
        ...(moduleData.description !== undefined && { description: moduleData.description }),
        ...(moduleData.isActive !== undefined && { is_active: moduleData.isActive }),
      },
    });

    return ModuleMapper.toDomain(updatedModule);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.module.delete({
      where: { id },
    });
  }

  async exists(name: string, excludeId?: string): Promise<boolean> {
    const module = await this.prisma.module.findFirst({
      where: {
        name: name.toLowerCase(),
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    return !!module;
  }
}