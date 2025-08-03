export interface IDeviceControlService {
  activateLighting(deviceId: string, lightType: string, lightColor: string): Promise<void>;
  deactivateLighting(deviceId: string): Promise<void>;
}

