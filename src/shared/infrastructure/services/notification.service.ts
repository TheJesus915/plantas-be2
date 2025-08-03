import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { INotificationService } from '../../domain/interfaces/notification.interface';
import { NotificationRepository } from '../../../notifications/infrastructure/repositories/notification.repository';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class NotificationService implements INotificationService, OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private notificationRepository: NotificationRepository;

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      try {
        this.notificationRepository = this.moduleRef.get(NotificationRepository, { strict: false });
      } catch (error) {
        this.logger.warn('NotificationRepository not available, persistence will not work');
      }

      if (!admin.apps.length) {
        const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');

        const serviceAccount = {
          type: "service_account",
          project_id: this.configService.get<string>('FIREBASE_PROJECT_ID') || '',
          private_key_id: this.configService.get<string>('FIREBASE_PRIVATE_KEY_ID') || '',
          private_key: privateKey ? privateKey.replace(/\\n/g, '\n') : '',
          client_email: this.configService.get<string>('FIREBASE_CLIENT_EMAIL') || '',
          client_id: this.configService.get<string>('FIREBASE_CLIENT_ID') || '',
          auth_uri: this.configService.get<string>('FIREBASE_AUTH_URI') || '',
          token_uri: this.configService.get<string>('FIREBASE_TOKEN_URI') || '',
          auth_provider_x509_cert_url: this.configService.get<string>('FIREBASE_AUTH_PROVIDER_X509_CERT_URL') || '',
          client_x509_cert_url: this.configService.get<string>('FIREBASE_CLIENT_X509_CERT_URL') || '',
          universe_domain: this.configService.get<string>('FIREBASE_UNIVERSE_DOMAIN') || ''
        };

        if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
          this.logger.error('Critical Firebase configuration missing. Check environment variables.');
          return;
        }

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });

        this.logger.log('Firebase Admin SDK initialized successfully');
      }
    } catch (error) {
      this.logger.error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
    }
  }

  async sendToTopic(topicName: string, title: string, body: string, data?: Record<string, any>): Promise<string> {
    try {
      if (!admin.apps.length) {
        this.logger.warn('Firebase Admin SDK not initialized. Cannot send notification.');
        return 'notification-service-not-available';
      }

      const serializedData: Record<string, string> = {};

      if (data) {
        Object.keys(data).forEach(key => {
          if (typeof data[key] === 'object') {
            serializedData[key] = JSON.stringify(data[key]);
          } else {
            serializedData[key] = String(data[key]);
          }
        });
      }

      const message: admin.messaging.Message = {
        notification: {
          title,
          body,
        },
        data: serializedData,
        topic: topicName,
      };

      const messageId = await admin.messaging().send(message);
      this.logger.log(`Notification sent to topic ${topicName}`);
      return messageId;
    } catch (error) {
      this.logger.error(`Error sending notification to topic ${topicName}: ${error.message}`);
      return 'notification-failed';
    }
  }

  async sendToUser(userId: string, title: string, body: string, data?: Record<string, any>): Promise<string> {
    const userTopicName = `users_${userId}`;
    const messageId = await this.sendToTopic(userTopicName, title, body, data);
    try {
      if (this.notificationRepository) {
        const payload = {
          title,
          body,
          data,
        };
        await this.notificationRepository.save(userId, payload);
        this.logger.log(`Notification persisted for user ${userId}`);
      }
    } catch (error) {
      this.logger.error(`Error persisting notification for user ${userId}: ${error.message}`);
    }

    return messageId;
  }

  async sendToMultipleTopics(topicNames: string[], title: string, body: string, data?: Record<string, any>): Promise<string> {
    try {
      if (!admin.apps.length) {
        this.logger.warn('Firebase Admin SDK not initialized. Cannot send notification.');
        return 'notification-service-not-available';
      }

      const condition = topicNames.map(topic => `'${topic}' in topics`).join(' || ');

      const serializedData: Record<string, string> = {};

      if (data) {
        Object.keys(data).forEach(key => {
          if (typeof data[key] === 'object') {
            serializedData[key] = JSON.stringify(data[key]);
          } else {
            serializedData[key] = String(data[key]);
          }
        });
      }

      const message: admin.messaging.Message = {
        notification: {
          title,
          body,
        },
        data: serializedData,
        condition,
      };

      const messageId = await admin.messaging().send(message);
      this.logger.log(`Notification sent to multiple topics: ${topicNames.join(', ')}`);
      return messageId;
    } catch (error) {
      this.logger.error(`Error sending notification to multiple topics: ${error.message}`);
      return 'notification-failed';
    }
  }
}