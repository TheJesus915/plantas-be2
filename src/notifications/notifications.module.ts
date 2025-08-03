import { Module } from '@nestjs/common';
import { NotificationsController } from './presentation/controllers/notifications.controller';
import { NotificationRepository } from './infrastructure/repositories/notification.repository';
import { NotificationMapper } from './infrastructure/mappers/notification.mapper';
import { SharedModule } from '../shared/shared.module';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { GetUserNotificationsUseCase } from './application/use-cases/get-user-notifications.use-case';
import { DeleteNotificationUseCase } from './application/use-cases/delete-notification.use-case';

@Module({
  imports: [SharedModule],
  controllers: [NotificationsController],
  providers: [
    NotificationRepository,
    NotificationMapper,
    CreateNotificationUseCase,
    GetUserNotificationsUseCase,
    DeleteNotificationUseCase,
  ],
  exports: [NotificationRepository, CreateNotificationUseCase],
})
export class NotificationsModule {}
