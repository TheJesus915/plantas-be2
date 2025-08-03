import { Injectable, Inject, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { IDeviceRepository } from '../../domain/interfaces/device-repository.interface';
import { IPotsRepository } from '../../../user-garden/domain/interfaces/pots-repository.interface';
import { UnlinkDeviceDto } from '../dtos/unlink-device.dto';
import { CreateDeviceResponseDto } from '../dtos/create-device.response.dto';
import { DeviceStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UnlinkDeviceUseCase {
  constructor(
    @Inject('IDeviceRepository')
    private readonly deviceRepository: IDeviceRepository,
    @Inject('IPotsRepository')
    private readonly potsRepository: IPotsRepository
  ) {}

  async execute(userId: string, dto: UnlinkDeviceDto): Promise<CreateDeviceResponseDto> {
    try {
      if (!userId || userId.trim() === '') {
        throw new BadRequestException('User ID is required');
      }

      if (!dto.device_id || dto.device_id.trim() === '') {
        throw new BadRequestException('Device ID is required');
      }

      const device = await this.deviceRepository.findById(dto.device_id);
      if (!device) {
        throw new NotFoundException('Device not found');
      }

      if (device.status !== DeviceStatus.LINKED) {
        throw new ConflictException('Device is not linked');
      }

      const pot = await this.potsRepository.findByDeviceId(device.id);
      if (!pot) {
        throw new NotFoundException('Associated pot not found');
      }

      if (pot.user_id !== userId) {
        throw new BadRequestException('You do not have permission to unlink this device');
      }

      const updatedDevice = await this.deviceRepository.update(device.id, {
        status: DeviceStatus.AVAILABLE,
        linked_at: null
      });

      await this.potsRepository.updateDevice(pot.id, { device_id: null });

      return plainToInstance(CreateDeviceResponseDto, {
        id: updatedDevice.id
      }, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while unlinking the device');
    }
  }
}