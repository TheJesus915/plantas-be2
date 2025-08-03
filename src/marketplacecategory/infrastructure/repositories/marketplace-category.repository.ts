import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { MarketplaceCategory } from '../../domain/entities/marketplace-category.entity';
import { IMarketplaceCategoryRepository } from '../../domain/interfaces/marketplace-category.repository.interface';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

@Injectable()
export class MarketplaceCategoryRepository implements IMarketplaceCategoryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService
  ) {}

  async create(category: MarketplaceCategory): Promise<any> {
    return await this.prisma.marketplaceCategory.create({
      data: {
        id: category.id,
        name: category.name,
        image_url: category.image_url,
        is_active: category.is_active,
        parent_id: category.parent_id,
        created_at: category.created_at
      }
    });
  }

  async findByName(name: string): Promise<any | null> {
    return await this.prisma.marketplaceCategory.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });
  }

  async findById(id: string): Promise<any | null> {
    return await this.prisma.marketplaceCategory.findUnique({
      where: { id }
    });
  }

  async findByParentId(parentId: string | null): Promise<any[]> {
    return await this.prisma.marketplaceCategory.findMany({
      where: { parent_id: parentId },
      select: {
        id: true,
        name: true,
        image_url: true,
        is_active: true,
        created_at: true
      },
      orderBy: { created_at: 'asc' }
    });
  }

  async findActiveByParentId(parentId: string | null): Promise<any[]> {
    return await this.prisma.marketplaceCategory.findMany({
      where: {
        parent_id: parentId,
        is_active: true
      },
      select: {
        id: true,
        name: true,
        image_url: true
      },
      orderBy: { created_at: 'asc' }
    });
  }

  async findByParentIdPaginated(parentId: string | null, filter: PaginationFilterDto): Promise<{ data: any[]; totalItems: number }> {
    let where: any = { parent_id: parentId };

    if (filter.search) {
      where = {
        ...where,
        name: {
          contains: filter.search,
          mode: 'insensitive'
        }
      };
    }

    const totalItems = await this.prisma.marketplaceCategory.count({ where });
    const { skip, take } = this.paginationService.getPaginationParameters(filter);
    const orderBy = this.paginationService.buildOrderByClause(filter, 'created_at');

    const data = await this.prisma.marketplaceCategory.findMany({
      where,
      select: {
        id: true,
        name: true,
        image_url: true,
        is_active: true,
        created_at: true
      },
      skip,
      take,
      orderBy
    });

    return { data, totalItems };
  }

  async findActiveByParentIdPaginated(parentId: string | null, filter: PaginationFilterDto): Promise<{ data: any[]; totalItems: number }> {
    let where: any = {
      parent_id: parentId,
      is_active: true
    };

    if (filter.search) {
      where = {
        ...where,
        name: {
          contains: filter.search,
          mode: 'insensitive'
        }
      };
    }

    const totalItems = await this.prisma.marketplaceCategory.count({ where });
    const { skip, take } = this.paginationService.getPaginationParameters(filter);
    const orderBy = this.paginationService.buildOrderByClause(filter, 'created_at');

    const data = await this.prisma.marketplaceCategory.findMany({
      where,
      select: {
        id: true,
        name: true,
        image_url: true
      },
      skip,
      take,
      orderBy
    });

    return { data, totalItems };
  }

  async update(id: string, data: Partial<MarketplaceCategory>): Promise<any> {
    return await this.prisma.marketplaceCategory.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.is_active !== undefined && { is_active: data.is_active })
      }
    });
  }

  async updateImage(id: string, imageUrl: string): Promise<any> {
    return await this.prisma.marketplaceCategory.update({
      where: { id },
      data: { image_url: imageUrl }
    });
  }

  async removeImage(id: string): Promise<any> {
    return await this.prisma.marketplaceCategory.update({
      where: { id },
      data: { image_url: null }
    });
  }
}