import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../infrastructure/repositories/notification.repository';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class GetUserNotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(userId: string): Promise<Notification[]> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      return await this.notificationRepository.findByUserId(userId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve notifications');
    }
  }
}
