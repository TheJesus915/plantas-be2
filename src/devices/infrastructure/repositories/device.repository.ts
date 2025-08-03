import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { DeviceEntity } from '../../domain/entities/device.entity';
import { IDeviceRepository, CreateDeviceData } from '../../domain/interfaces/device-repository.interface';
import { PaginationFilterDto, PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';
import { Prisma } from '@prisma/client';
import { DeviceMapper } from '../mappers/device.mapper';
import { ILinkingKeyService } from '../../domain/interfaces/linking-key-service.interface';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';

@Injectable()
export class DeviceRepository implements IDeviceRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly deviceMapper: DeviceMapper,
    private readonly paginationService: PaginationService,
    @Inject('ILinkingKeyService')
    private readonly linkingKeyService: ILinkingKeyService
  ) {}

  async create(data: CreateDeviceData): Promise<DeviceEntity> {
    const linking_key = await this.linkingKeyService.ensureUnique();

    const device = await this.prisma.device.create({
      data: {
        status: data.status,
        identifier: data.identifier,
        linking_key,
        linked_at: data.linked_at
      }
    });

    return this.deviceMapper.toDomain(device);
  }

  async update(id: string, data: Partial<DeviceEntity>): Promise<DeviceEntity> {
    const device = await this.prisma.device.update({
      where: { id },
      data
    });

    return this.deviceMapper.toDomain(device);
  }

  async findById(id: string): Promise<DeviceEntity | null> {
    const device = await this.prisma.device.findUnique({
      where: { id }
    });

    return device ? this.deviceMapper.toDomain(device) : null;
  }

  async findByIdentifier(identifier: string): Promise<DeviceEntity | null> {
    const device = await this.prisma.device.findFirst({
      where: { identifier }
    });

    return device ? this.deviceMapper.toDomain(device) : null;
  }

  async findByLinkingKey(linking_key: string): Promise<DeviceEntity | null> {
    const device = await this.prisma.device.findFirst({
      where: { linking_key }
    });

    return device ? this.deviceMapper.toDomain(device) : null;
  }

  async findByIds(ids: string[]): Promise<DeviceEntity[]> {
    const devices = await this.prisma.device.findMany({
      where: {
        id: { in: ids }
      }
    });

    return devices.map(device => this.deviceMapper.toDomain(device));
  }

  async findAll(filter: PaginationFilterDto): Promise<PaginatedResponseDto<DeviceEntity>> {
    const where: Prisma.DeviceWhereInput = {
      ...(filter.search && {
        OR: [
          { identifier: { contains: filter.search, mode: 'insensitive' } },
          { linking_key: { contains: filter.search, mode: 'insensitive' } }
        ]
      })
    };

    const totalItems = await this.prisma.device.count({ where });
    const { skip, take } = this.paginationService.getPaginationParameters(filter);
    const orderBy = this.paginationService.buildOrderByClause(filter, 'registered_at');

    const items = await this.prisma.device.findMany({
      where,
      skip,
      take,
      orderBy
    });

    const deviceEntities = items.map(device => this.deviceMapper.toDomain(device));

    return this.paginationService.paginate(deviceEntities, totalItems, filter);
  }

  async regenerateLinkingKey(id: string): Promise<DeviceEntity> {
    const linking_key = await this.linkingKeyService.ensureUnique();

    const device = await this.prisma.device.update({
      where: { id },
      data: { linking_key }
    });

    return this.deviceMapper.toDomain(device);
  }

  async getLatestReadingsForDevice(deviceId: string): Promise<{ temperature: number; humidity: number; created_at: Date } | null> {
    const latestReading = await this.prisma.readings.findFirst({
      where: { device_id: deviceId },
      orderBy: { created_at: 'desc' }
    });

    if (!latestReading) {
      return null;
    }

    return {
      temperature: latestReading.temperature,
      humidity: latestReading.humidity,
      created_at: latestReading.created_at
    };
  }

  async isUserDevice(deviceId: string, userId: string): Promise<boolean> {
    const pot = await this.prisma.pot.findFirst({
      where: {
        device_id: deviceId,
        user_id: userId
      }
    });

    return !!pot;
  }
}