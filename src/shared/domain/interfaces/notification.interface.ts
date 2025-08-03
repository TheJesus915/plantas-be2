export interface INotificationService {
  sendToTopic(topicName: string, title: string, body: string, data?: Record<string, any>): Promise<string>;
  sendToUser(userId: string, title: string, body: string, data?: Record<string, any>): Promise<string>;
  sendToMultipleTopics(topicNames: string[], title: string, body: string, data?: Record<string, any>): Promise<string>;
}