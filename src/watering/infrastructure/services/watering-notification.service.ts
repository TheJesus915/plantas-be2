import { Injectable, Logger, Inject } from '@nestjs/common';
import { IWateringNotificationService } from '../../domain/interfaces/watering-notification-service.interface';
import { INotificationService } from '../../../shared/domain/interfaces/notification.interface';

@Injectable()
export class WateringNotificationService implements IWateringNotificationService {
  private readonly logger = new Logger(WateringNotificationService.name);

  constructor(
    @Inject('INotificationService')
    private readonly notificationService: INotificationService
  ) {}

  async sendWateringNotification(
    userId: string,
    groupName: string,
    potId: string,
    startTime: string,
    endTime: string
  ): Promise<void> {
    try {
      const title = 'Riego Iniciado';
      const body = `El riego programado para el grupo "${groupName}" ha comenzado y finalizará a las ${endTime}.`;
      const data = {
        type: 'watering_started',
        groupName,
        potId,
        startTime,
        endTime
      };

      await this.notificationService.sendToUser(userId, title, body, data);
    } catch (error) {
      this.logger.error(`Failed to send watering notification: ${error.message}`);
      throw error;
    }
  }

  async sendWateringErrorNotification(
    userId: string,
    groupName: string,
    potId: string,
    errorMessage: string
  ): Promise<void> {
    try {
      const title = 'Error de Riego';
      const body = `Ha ocurrido un error en el riego del grupo "${groupName}": ${errorMessage}`;
      const data = {
        type: 'watering_error',
        groupName,
        potId,
        errorMessage
      };

      await this.notificationService.sendToUser(userId, title, body, data);
    } catch (error) {
      this.logger.error(`Failed to send watering error notification: ${error.message}`);
      throw error;
    }
  }
}