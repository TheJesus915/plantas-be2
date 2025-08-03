import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../infrastructure/repositories/notification.repository';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class CreateNotificationUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(userId: string, payload: any): Promise<Notification> {
    return this.notificationRepository.save(userId, payload);
  }
}
