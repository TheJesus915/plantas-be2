import { Injectable, Inject, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { IDeviceRepository } from '../../domain/interfaces/device-repository.interface';
import { DeviceDetailResponseDto } from '../dtos/device.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetDeviceByIdUseCase {
  constructor(
    @Inject('IDeviceRepository')
    private readonly deviceRepository: IDeviceRepository
  ) {}

  async execute(id: string): Promise<DeviceDetailResponseDto> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('Device ID is required');
      }

      const device = await this.deviceRepository.findById(id);
      if (!device) {
        throw new NotFoundException('Device not found');
      }

      return plainToInstance(DeviceDetailResponseDto, device, {
        excludeExtraneousValues: true
      });
    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while retrieving the device');
    }
  }
}