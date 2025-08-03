import { Notification } from '../../domain/entities/notification.entity';

export class NotificationResponseDto {
  id: string;
  payload: any;
  created_at: Date;

  constructor(notification: Notification) {
    this.id = notification.id;
    this.payload = notification.payload;
    this.created_at = notification.created_at;
  }
}
