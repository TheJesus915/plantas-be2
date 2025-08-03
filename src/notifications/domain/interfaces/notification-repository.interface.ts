import { Notification } from '../entities/notification.entity';

export interface INotificationRepository {
  save(userId: string, payload: any): Promise<Notification>;
  findByUserId(userId: string): Promise<Notification[]>;
  delete(id: string, userId: string): Promise<void>;
}
