import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { IAreasRepository } from '../../domain/interfaces/areas-repository.interface';
import { AreaEntity } from '../../domain/entities/area.entity';
import { AreaMapper } from '../mappers/area.mapper';
import { Prisma, AreaType } from '@prisma/client';

@Injectable()
export class AreasRepository implements IAreasRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly areaMapper: AreaMapper
  ) {}

  async create(data: any): Promise<string> {
    const area = await this.prisma.area.create({
      data: {
        user_id: data.user_id,
        name: data.name,
        description: data.description || null,
        image_url: data.image_url || null,
        area_type: data.area_type || AreaType.INTERIOR
      }
    });
    return area.id;
  }

  async findById(id: string): Promise<AreaEntity | null> {
    const area = await this.prisma.area.findUnique({
      where: { id }
    });
    return area ? this.areaMapper.toDomain(area) : null;
  }

  async findByName(userId: string, name: string): Promise<AreaEntity | null> {
    const area = await this.prisma.area.findFirst({
      where: {
        user_id: userId,
        name: name
      }
    });
    return area ? this.areaMapper.toDomain(area) : null;
  }

  async findByUserId(userId: string, filters?: any): Promise<any> {
    const whereClause: Prisma.AreaWhereInput = {
      user_id: userId,
      ...(filters.search ? {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' as Prisma.QueryMode } },
          { description: { contains: filters.search, mode: 'insensitive' as Prisma.QueryMode } }
        ]
      } : {})
    };

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const orderBy: Prisma.AreaOrderByWithRelationInput = filters.sortBy
      ? { [filters.sortBy]: filters.sortOrder as Prisma.SortOrder }
      : { created_at: 'desc' as Prisma.SortOrder };

    const [areas, totalItems] = await Promise.all([
      this.prisma.area.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          image_url: true,
          _count: {
            select: {
              pots: true
            }
          }
        },
        skip: skip,
        take: limit,
        orderBy
      }),
      this.prisma.area.count({
        where: whereClause
      })
    ]);

    const formattedAreas = areas.map(area => ({
      id: area.id,
      name: area.name,
      image_url: area.image_url,
      pots_count: area._count.pots
    }));

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: formattedAreas,
      meta: {
        page: page,
        limit: limit,
        totalItems,
        totalPages
      }
    };
  }

  async update(id: string, data: any): Promise<string> {
    const area = await this.prisma.area.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        area_type: data.area_type
      }
    });
    return area.id;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.area.delete({
      where: { id }
    });
  }

  async count(userId: string, filters?: any): Promise<number> {
    return this.prisma.area.count({
      where: {
        user_id: userId
      }
    });
  }
}