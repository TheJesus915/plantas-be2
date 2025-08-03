import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { ICatalogPlantRepository } from '../../domain/interfaces/catalog-plant-repository.interface';
import { catalogplant, plantimages } from '@prisma/client';

@Injectable()
export class CatalogPlantRepository implements ICatalogPlantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(plantData: Omit<catalogplant, 'id' | 'created_at'>): Promise<catalogplant> {
    return this.prisma.catalogplant.create({
      data: plantData,
    });
  }

  async findById(id: string): Promise<
    | (catalogplant & {
    plantimages?: plantimages[];
    taxonomicNode?: any;
  })
    | null
  > {
    const result = await this.prisma.catalogplant.findUnique({
      where: { id },
      include: {
        plantimages: {
          select: {
            id: true,
            image_url: true,
            created_at: true,
            catalog_id: true
          }
        },
        taxonomicNode: true
      }
    });

    return result;
  }

  async findByName(name: string): Promise<catalogplant | null> {
    return this.prisma.catalogplant.findFirst({
      where: { name },
    });
  }

  async update(id: string, plantData: Partial<catalogplant>): Promise<catalogplant> {
    const result = await this.prisma.catalogplant.update({
      where: { id },
      data: plantData,
      include: {
        plantimages: true,
        taxonomicNode: true
      }
    });

    return result;
  }

  async delete(id: string): Promise<catalogplant> {
    return this.prisma.catalogplant.delete({
      where: { id },
    });
  }

  async findAll(page: number, limit: number): Promise<{ plants: catalogplant[]; total: number }> {
    const skip = (page - 1) * limit;

    const [plants, total] = await Promise.all([
      this.prisma.catalogplant.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.catalogplant.count(),
    ]);

    return { plants, total };
  }

  async findAllPaginated(
    where: any,
    skip: number,
    take: number,
    orderBy: any
  ): Promise<{ plants: any[]; total: number }> {
    const [plants, total] = await Promise.all([
      this.prisma.catalogplant.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          name: true,
          planttype: true,
          plantimages: {
            take: 1,
            orderBy: { created_at: 'desc' },
            select: {
              id: true,
              image_url: true
            }
          },
          taxonomicNode: {
            select: {
              id: true,
              name: true,
              rank: true
            }
          }
        }
      }),
      this.prisma.catalogplant.count({ where }),
    ]);

    return { plants, total };
  }

  async getTaxonomicAncestry(nodeId: string): Promise<Array<{id: string; name: string; rank: string}>> {
    let ancestors: Array<{id: string; name: string; rank: string}> = [];
    let currentNodeId = nodeId;

    while (currentNodeId) {
      const node = await this.prisma.taxonomicNode.findUnique({
        where: { id: currentNodeId }
      });

      if (!node) break;

      ancestors.unshift({
        id: node.id,
        name: node.name,
        rank: node.rank
      });

      if (!node.parentId) break;
      currentNodeId = node.parentId;
    }

    return ancestors;
  }

  async checkPlantWithTaxonomicNode(
    taxonomicNodeId: string,
    excludeCatalogId?: string
  ): Promise<{ exists: boolean; plantName?: string }> {
    const existingPlant = await this.prisma.catalogplant.findFirst({
      where: {
        taxonomicNodeId,
        ...(excludeCatalogId && {
          NOT: { id: excludeCatalogId }
        })
      },
      select: { name: true }
    });

    if (existingPlant) {
      return {
        exists: true,
        plantName: existingPlant.name
      };
    }

    return { exists: false };
  }

  async isPlantInUse(id: string): Promise<boolean> {
    const potsCount = await this.prisma.pot.count({
      where: {
        plant_id: id
      }
    });

    return potsCount > 0;
  }
}