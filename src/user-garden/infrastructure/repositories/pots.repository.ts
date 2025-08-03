import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';
import { PotEntity } from '../../domain/entities/pot.entity';
import {
  IPotsRepository,
  CreatePotData,
  UpdatePotData,
  UpdatePotDeviceData,
} from '../../domain/interfaces/pots-repository.interface';
import { PaginatedResponseDto, PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { PotMapper } from '../mappers/pot.mapper';
import { Prisma } from '@prisma/client';
import { PotFilterDto } from '../../application/dtos/pots/pot-filter.dto';

@Injectable()
export class PotsRepository implements IPotsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly potMapper: PotMapper
  ) {}

  async findByName(userId: string, name: string): Promise<PotEntity | null> {
    const pot = await this.prisma.pot.findFirst({
      where: {
        user_id: userId,
        name: name
      },
      include: {
        plant: {
          select: {
            name: true
          }
        },
        area: {
          select: {
            name: true
          }
        }
      }
    });

    if (!pot) return null;

    return this.potMapper.toDomain(pot);
  }

  async updateDevice(id: string, data: UpdatePotDeviceData): Promise<void> {
    await this.prisma.pot.update({
      where: { id },
      data: { device_id: data.device_id }
    });
  }

  async create(data: CreatePotData): Promise<string> {
    const createData: Prisma.PotCreateInput = {
      user: {
        connect: { id: data.user_id }
      },
      name: data.name,
      description: data.description || null,
      image_url: data.image_url || null,
      area: {
        connect: { id: data.area_id }
      },
      plant: {
        connect: { id: data.plant_id }
      },
      floor: data.floor || 1
    };

    const createdPot = await this.prisma.pot.create({
      data: createData
    });

    return createdPot.id;
  }

  async update(id: string, data: UpdatePotData): Promise<string> {
    const updateData: Prisma.PotUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image_url !== undefined) updateData.image_url = data.image_url;
    if (data.plant_id) updateData.plant = { connect: { id: data.plant_id } };
    if (data.area_id) updateData.area = { connect: { id: data.area_id } };
    if (data.floor !== undefined) updateData.floor = data.floor;

    const updatedPot = await this.prisma.pot.update({
      where: { id },
      data: updateData
    });

    return updatedPot.id;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.pot.delete({
      where: { id }
    });
  }

  async findById(id: string): Promise<PotEntity | null> {
    const pot = await this.prisma.pot.findUnique({
      where: { id },
      include: {
        plant: {
          select: {
            name: true
          }
        },
        area: {
          select: {
            name: true
          }
        }
      }
    });

    if (!pot) return null;

    return this.potMapper.toDomain(pot);
  }

  async findByUser(userId: string, filter: PotFilterDto): Promise<PaginatedResponseDto<any>> {
    const whereClause: Prisma.PotWhereInput = {
      user_id: userId,
      ...(filter.search ? {
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' as Prisma.QueryMode } },
          { description: { contains: filter.search, mode: 'insensitive' as Prisma.QueryMode } }
        ]
      } : {}),
      ...(filter.areaId ? { area_id: filter.areaId } : {}),
      ...(filter.has_device === 'true' ? { device_id: { not: null } } : {})
    };

    const { skip, take } = this.paginationService.getPaginationParameters(filter);

    const orderBy: Prisma.PotOrderByWithRelationInput = filter.sortBy
      ? { [filter.sortBy]: filter.sortOrder as Prisma.SortOrder }
      : { created_at: 'desc' as Prisma.SortOrder };

    const [pots, totalItems] = await Promise.all([
      this.prisma.pot.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          image_url: true,
          device_id: true,
          plant: {
            select: {
              name: true
            }
          }
        },
        skip,
        take,
        orderBy
      }),
      this.prisma.pot.count({
        where: whereClause
      })
    ]);

    const potsWithPlantName = pots.map(pot => ({
      id: pot.id,
      name: pot.name,
      image_url: pot.image_url,
      plant_name: pot.plant?.name || null,
      has_device: pot.device_id !== null
    }));

    return this.paginationService.paginate(potsWithPlantName, totalItems, filter);
  }

  async findByDeviceId(deviceId: string): Promise<PotEntity | null> {
    const pot = await this.prisma.pot.findFirst({
      where: { device_id: deviceId },
      include: {
        plant: {
          select: {
            name: true
          }
        },
        area: {
          select: {
            name: true
          }
        }
      }
    });

    if (!pot) return null;

    return this.potMapper.toDomain(pot);
  }

  async findByUserWithDevices(userId: string, filter: PaginationFilterDto): Promise<PaginatedResponseDto<PotEntity>> {
    const whereClause: Prisma.PotWhereInput = {
      user_id: userId,
      device_id: {
        not: null
      },
      ...(filter.search ? {
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' as Prisma.QueryMode } },
          { description: { contains: filter.search, mode: 'insensitive' as Prisma.QueryMode } }
        ]
      } : {})
    };

    const { skip, take } = this.paginationService.getPaginationParameters(filter);

    const orderBy: Prisma.PotOrderByWithRelationInput = filter.sortBy
      ? { [filter.sortBy]: filter.sortOrder as Prisma.SortOrder }
      : { created_at: 'desc' as Prisma.SortOrder };

    const [pots, totalItems] = await Promise.all([
      this.prisma.pot.findMany({
        where: whereClause,
        include: {
          plant: {
            select: {
              name: true
            }
          },
          area: {
            select: {
              name: true
            }
          }
        },
        skip,
        take,
        orderBy
      }),
      this.prisma.pot.count({
        where: whereClause
      })
    ]);

    const mappedPots = pots.map(pot => this.potMapper.toDomain(pot));
    return this.paginationService.paginate(mappedPots, totalItems, filter);
  }

  async unlinkDevice(id: string): Promise<void> {
    await this.prisma.pot.update({
      where: { id },
      data: { device_id: null }
    });
  }

  async getLatestReadingsForPot(potId: string): Promise<{ temperature: number; humidity: number } | null> {
    const latestReading = await this.prisma.readings.findFirst({
      where: {
        pot_id: potId
      },
      orderBy: {
        created_at: 'desc'
      },
      select: {
        temperature: true,
        humidity: true
      }
    });

    return latestReading;
  }

  async getDeviceStatusForPot(potId: string): Promise<{ light_on: boolean; watering_on: boolean } | null> {
    const pot = await this.prisma.pot.findUnique({
      where: { id: potId },
      select: {
        device_id: true,
        device: {
          select: {
            light_on: true,
            watering_on: true
          }
        }
      }
    });

    if (!pot || !pot.device_id || !pot.device) {
      return null;
    }

    return {
      light_on: pot.device.light_on,
      watering_on: pot.device.watering_on
    };
  }
}