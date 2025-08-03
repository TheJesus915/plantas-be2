import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '../../infrastructure/repositories/notification.repository';

@Injectable()
export class DeleteNotificationUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    try {
      if (!id) {
        throw new BadRequestException('Notification ID is required');
      }

      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      await this.notificationRepository.delete(id, userId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete notification');
    }
  }
}
