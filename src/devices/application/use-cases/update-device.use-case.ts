import { Injectable, Inject, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { IDeviceRepository } from '../../domain/interfaces/device-repository.interface';
import { UpdateDeviceDto } from '../dtos/update-device.dto';
import { CreateDeviceResponseDto } from '../dtos/create-device.response.dto';
import { DeviceStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateDeviceUseCase {
  constructor(
    @Inject('IDeviceRepository')
    private readonly deviceRepository: IDeviceRepository
  ) {}

  async execute(id: string, dto: UpdateDeviceDto): Promise<CreateDeviceResponseDto> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('Device ID is required');
      }

      if (!dto || Object.keys(dto).length === 0) {
        throw new BadRequestException('At least one field must be provided for update');
      }

      const device = await this.deviceRepository.findById(id);
      if (!device) {
        throw new NotFoundException('Device not found');
      }

      if (dto.status) {
        await this.validateStatusChange(device.status, dto.status);
      }

      if (dto.identifier && dto.identifier !== device.identifier) {
        if (dto.identifier.trim() === '') {
          throw new BadRequestException('Device identifier cannot be empty');
        }

        const existingDevice = await this.deviceRepository.findByIdentifier(dto.identifier);
        if (existingDevice) {
          throw new ConflictException('Device identifier already exists');
        }
      }

      const updatedDevice = await this.deviceRepository.update(id, dto);

      return plainToInstance(CreateDeviceResponseDto, {
        id: updatedDevice.id
      }, { excludeExtraneousValues: true });
    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while updating the device');
    }
  }

  private async validateStatusChange(currentStatus: DeviceStatus, newStatus: DeviceStatus): Promise<void> {
    if (newStatus === DeviceStatus.DISABLED) {
      if (currentStatus === DeviceStatus.DISABLED) {
        throw new ConflictException('Device is already disabled');
      }
      if (currentStatus === DeviceStatus.LINKED) {
        throw new BadRequestException('Cannot disable a linked device');
      }
    }

    if (newStatus === DeviceStatus.AVAILABLE) {
      if (currentStatus === DeviceStatus.LINKED) {
        throw new BadRequestException('Cannot change linked device to available');
      }
    }

    if (newStatus === DeviceStatus.LINKED) {
      if (currentStatus === DeviceStatus.DISABLED) {
        throw new BadRequestException('Cannot link a disabled device');
      }
      if (currentStatus === DeviceStatus.LINKED) {
        throw new BadRequestException('Device is already linked');
      }
    }
  }
}