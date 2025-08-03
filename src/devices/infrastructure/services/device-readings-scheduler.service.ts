import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeviceReadingsGateway } from '../../presentation/gateways/device-readings.gateway';
import { GetDeviceReadingsUseCase } from '../../application/use-cases/get-device-readings.use-case';

@Injectable()
export class DeviceReadingsSchedulerService {
  constructor(
    private readonly deviceReadingsGateway: DeviceReadingsGateway,
    private readonly getDeviceReadingsUseCase: GetDeviceReadingsUseCase
  ) {}

  @Cron('*/5 * * * * *')
  async updateDeviceReadings() {
    try {
      const activeDevices = this.deviceReadingsGateway.getActiveDevices();

      for (const deviceId of activeDevices) {
        const userId = this.deviceReadingsGateway.getUserIdForDevice(deviceId);

        if (userId) {
          const deviceReadings = await this.getDeviceReadingsUseCase.execute(userId, deviceId);
          this.deviceReadingsGateway.broadcastDeviceUpdate(deviceId, deviceReadings);
        }
      }
    } catch (error) {
      console.error('Error updating device readings:', error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async cleanupConnections() {
    this.deviceReadingsGateway.cleanupOrphanedConnections();
  }
}
