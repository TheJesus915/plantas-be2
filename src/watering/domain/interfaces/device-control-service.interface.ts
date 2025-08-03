export interface IDeviceControlService {
  activateWatering(deviceId: string): Promise<void>;
  deactivateWatering(deviceId: string): Promise<void>;
}

