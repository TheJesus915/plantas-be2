import { Injectable, Logger, Inject } from '@nestjs/common';
import { ILightingNotificationService } from '../../domain/interfaces/lighting-notification-service.interface';
import { INotificationService } from '../../../shared/domain/interfaces/notification.interface';

@Injectable()
export class LightingNotificationService implements ILightingNotificationService {
  private readonly logger = new Logger(LightingNotificationService.name);

  constructor(
    @Inject('INotificationService')
    private readonly notificationService: INotificationService
  ) {}

  async sendLightingNotification(
    userId: string,
    groupName: string,
    potId: string,
    lightType: string,
    lightColor: string,
    startTime: string,
    endTime: string
  ): Promise<void> {
    try {
      const title = 'Iluminación Iniciada';
      const body = `La iluminación programada para el grupo "${groupName}" ha comenzado con intensidad ${lightType} y finalizará a las ${endTime}.`;
      const data = {
        type: 'lighting_started',
        groupName,
        potId,
        lightType,
        lightColor,
        startTime,
        endTime
      };

      await this.notificationService.sendToUser(userId, title, body, data);
    } catch (error) {
      this.logger.error(`Failed to send lighting notification: ${error.message}`);
      throw error;
    }
  }

  async sendLightingErrorNotification(
    userId: string,
    groupName: string,
    potId: string,
    errorMessage: string
  ): Promise<void> {
    try {
      const title = 'Error de Iluminación';
      const body = `Ha ocurrido un error en la iluminación del grupo "${groupName}": ${errorMessage}`;
      const data = {
        type: 'lighting_error',
        groupName,
        potId,
        errorMessage
      };

      await this.notificationService.sendToUser(userId, title, body, data);
    } catch (error) {
      this.logger.error(`Failed to send lighting error notification: ${error.message}`);
      throw error;
    }
  }
}
