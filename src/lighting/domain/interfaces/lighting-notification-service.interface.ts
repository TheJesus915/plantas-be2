export interface ILightingNotificationService {
  sendLightingNotification(
    userId: string,
    groupName: string,
    potId: string,
    lightType: string,
    lightColor: string,
    startTime: string,
    endTime: string
  ): Promise<void>;

  sendLightingErrorNotification(
    userId: string,
    groupName: string,
    potId: string,
    errorMessage: string
  ): Promise<void>;
}
