export interface NotificationService {
  sendToUser(userId: string, title: string, body: string, data?: Record<string, any>): Promise<string>;
}