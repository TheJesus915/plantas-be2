import { Injectable, Inject, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { IDeviceRepository } from '../../domain/interfaces/device-repository.interface';
import { DeviceStatus } from '@prisma/client';
import { CreateDeviceResponseDto } from '../dtos/create-device.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RegenerateLinkingKeyUseCase {
  constructor(
    @Inject('IDeviceRepository')
    private readonly deviceRepository: IDeviceRepository
  ) {}

  async execute(id: string): Promise<CreateDeviceResponseDto> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('Device ID is required');
      }

      const device = await this.deviceRepository.findById(id);
      if (!device) {
        throw new NotFoundException('Device not found');
      }

      if (device.status === DeviceStatus.DISABLED) {
        throw new ConflictException('Device is disabled');
      }

      if (device.status === DeviceStatus.LINKED) {
        throw new ConflictException('Device is already linked');
      }

      const updatedDevice = await this.deviceRepository.regenerateLinkingKey(id);

      return plainToInstance(CreateDeviceResponseDto, {
        id: updatedDevice.id
      }, { excludeExtraneousValues: true });
    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while regenerating the linking key');
    }
  }
}