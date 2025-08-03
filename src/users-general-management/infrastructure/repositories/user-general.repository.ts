import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { IUserGeneralRepository } from '../../domain/interfaces/user-general-repository.interface';
import { UserGeneralEntity, PotGeneralEntity, DeviceGeneralEntity } from '../../domain/entities/user-general.entity';
import { Role, StatusAccount } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserGeneralRepository implements IUserGeneralRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService
  ) {}

  async findAllGeneralUsers(filter: PaginationFilterDto): Promise<any> {
    const where: Prisma.UserWhereInput = {
      type: Role.general,
      ...(filter.search && {
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { lastname: { contains: filter.search, mode: 'insensitive' } },
          { email: { contains: filter.search, mode: 'insensitive' } }
        ]
      })
    };
    const totalItems = await this.prisma.user.count({ where });
    const { skip, take } = this.paginationService.getPaginationParameters(filter);
    const orderBy = this.paginationService.buildOrderByClause(filter, 'registration_date');
    const items = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        status_account: true,
        registration_date: true,
      },
    });
    return this.paginationService.paginate(items, totalItems, filter);
  }

  async findGeneralUserById(id: string): Promise<UserGeneralEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, type: Role.general },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        status_account: true,
        registration_date: true,
        pots: {
          select: {
            id: true,
            name: true,
            image_url: true,
            created_at: true,
            plant: {
              select: {
                id: true,
                name: true,
              },
            },
            device: {
              select: {
                id: true,
                linked_at: true,
              },
            },
          },
        },
      },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      status_account: user.status_account,
      created_at: user.registration_date,
      pots: user.pots.map(p => ({
        id: p.id,
        name: p.name,
        image: p.image_url,
        created_at: p.created_at,
        catalog_plant: p.plant
          ? { id: p.plant.id, name: p.plant.name }
          : { id: '', name: '' },
        device: p.device
          ? { id: p.device.id, name: '', status: '', linked_at: p.device.linked_at }
          : undefined,
      })),
    };
  }

  async updateStatusAccount(id: string, status: string): Promise<{ id: string }> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { status_account: status as StatusAccount },
      select: { id: true },
    });
    return { id: user.id };
  }
}
