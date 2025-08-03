import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { INotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { NotificationMapper } from '../mappers/notification.mapper';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationMapper: NotificationMapper,
  ) {}

  async save(userId: string, payload: any): Promise<Notification> {
    const notificationData = await this.prisma.notification.create({
      data: {
        userId,
        payload,
      },
    });

    return this.notificationMapper.toDomain(notificationData);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return notifications.map((notification) =>
      this.notificationMapper.toDomain(notification),
    );
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.notification.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}
