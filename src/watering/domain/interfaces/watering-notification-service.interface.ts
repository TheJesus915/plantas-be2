export interface IWateringNotificationService {
  sendWateringNotification(
    userId: string,
    groupName: string,
    potId: string,
    startTime: string,
    endTime: string
  ): Promise<void>;

  sendWateringErrorNotification(
    userId: string,
    groupName: string,
    potId: string,
    errorMessage: string
  ): Promise<void>;
}