import { Injectable } from '@nestjs/common';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class NotificationMapper {
  toDomain(raw: any): Notification {
    return new Notification({
      id: raw.id,
      userId: raw.userId,
      payload: raw.payload,
      created_at: raw.created_at,
    });
  }

  toPersistence(notification: Notification): any {
    return {
      id: notification.id,
      userId: notification.userId,
      payload: notification.payload,
    };
  }
}
