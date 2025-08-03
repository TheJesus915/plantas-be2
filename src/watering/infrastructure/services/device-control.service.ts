import { Injectable, Inject } from '@nestjs/common';
import { IDeviceControlService } from '../../domain/interfaces/device-control-service.interface';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';

@Injectable()
export class DeviceControlService implements IDeviceControlService {
  constructor(private readonly prismaService: PrismaService) {}

  async activateWatering(deviceId: string): Promise<void> {
    await this.prismaService.device.update({
      where: { id: deviceId },
      data: { watering_on: true }
    });
  }

  async deactivateWatering(deviceId: string): Promise<void> {
    await this.prismaService.device.update({
      where: { id: deviceId },
      data: { watering_on: false }
    });
  }
}
