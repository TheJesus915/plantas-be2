import { Injectable, Inject, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateDeviceDto } from '../dtos/create-device.dto';
import { CreateDeviceResponseDto } from '../dtos/create-device.response.dto';
import { IDeviceRepository } from '../../domain/interfaces/device-repository.interface';
import { DeviceStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateDeviceUseCase {
  constructor(
    @Inject('IDeviceRepository')
    private readonly deviceRepository: IDeviceRepository
  ) {}

  async execute(dto: CreateDeviceDto): Promise<CreateDeviceResponseDto> {
    try {
      if (!dto.identifier || dto.identifier.trim() === '') {
        throw new BadRequestException('Device identifier is required');
      }

      const existingDevice = await this.deviceRepository.findByIdentifier(dto.identifier);
      if (existingDevice) {
        throw new ConflictException('Device with this identifier already exists');
      }

      const device = await this.deviceRepository.create({
        identifier: dto.identifier,
        status: DeviceStatus.AVAILABLE,
        linked_at: null
      });

      return plainToInstance(CreateDeviceResponseDto, {
        id: device.id
      }, { excludeExtraneousValues: true });
    } catch (error) {

      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while creating the device');
    }
  }
}