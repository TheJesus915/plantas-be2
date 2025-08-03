import { Injectable } from '@nestjs/common';
import { IDeviceControlService } from '../../domain/interfaces/device-control-service.interface';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';

@Injectable()
export class DeviceControlService implements IDeviceControlService {
  constructor(private readonly prismaService: PrismaService) {}

  async activateLighting(deviceId: string): Promise<void> {
    await this.prismaService.device.update({
      where: { id: deviceId },
      data: {
        light_on: true
      }
    });
  }

  async deactivateLighting(deviceId: string): Promise<void> {
    await this.prismaService.device.update({
      where: { id: deviceId },
      data: { light_on: false }
    });
  }
}
