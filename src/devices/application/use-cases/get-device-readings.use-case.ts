import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IDeviceRepository } from '../../domain/interfaces/device-repository.interface';
import { DeviceReadingsResponseDto } from '../dtos/device-readings.dto';

@Injectable()
export class GetDeviceReadingsUseCase {
  constructor(
    @Inject('IDeviceRepository')
    private readonly deviceRepository: IDeviceRepository
  ) {}

  async execute(userId: string, deviceId: string): Promise<DeviceReadingsResponseDto> {
    const device = await this.deviceRepository.findById(deviceId);

    if (!device) {
      throw new Error('Device not found');
    }

    const latestReadings = await this.deviceRepository.getLatestReadingsForDevice(deviceId);

    return {
      deviceId,
      temperature: latestReadings?.temperature || 0,
      humidity: latestReadings?.humidity || 0,
      light_on: device.light_on || false,
      watering_on: device.watering_on || false,
      created_at: latestReadings?.created_at || undefined,
    };
  }
}
