import { Controller, Get, UseGuards, Request, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { GetUserNotificationsUseCase } from '../../application/use-cases/get-user-notifications.use-case';
import { DeleteNotificationUseCase } from '../../application/use-cases/delete-notification.use-case';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { NotificationResponseDto } from '../../application/dtos/notification-response.dto';

@Controller('user/notifications')
export class NotificationsController {
  constructor(
    private readonly getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserNotifications(@Request() req): Promise<NotificationResponseDto[]> {
    const userId = req.user?.sub;
    const notifications = await this.getUserNotificationsUseCase.execute(userId);
    return notifications.map(notification => new NotificationResponseDto(notification));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNotification(@Param('id') id: string, @Request() req): Promise<void> {
    const userId = req.user?.sub;
    await this.deleteNotificationUseCase.execute(id, userId);
  }
}
