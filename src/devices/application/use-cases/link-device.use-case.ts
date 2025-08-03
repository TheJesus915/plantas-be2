import { Injectable, Inject, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IDeviceRepository } from '../../domain/interfaces/device-repository.interface';
import { IPotsRepository } from '../../../user-garden/domain/interfaces/pots-repository.interface';
import { LinkDeviceDto } from '../dtos/link-device.dto';
import { CreateDeviceResponseDto } from '../dtos/create-device.response.dto';
import { DeviceStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LinkDeviceUseCase {
  constructor(
    @Inject('IDeviceRepository')
    private readonly deviceRepository: IDeviceRepository,
    @Inject('IPotsRepository')
    private readonly potsRepository: IPotsRepository
  ) {}

  async execute(userId: string, dto: LinkDeviceDto): Promise<CreateDeviceResponseDto> {
    try {
      if (!userId || userId.trim() === '') {
        throw new BadRequestException('User ID is required');
      }

      if (!dto.linking_key || dto.linking_key.trim() === '') {
        throw new BadRequestException('Linking key is required');
      }

      if (!dto.pot_id || dto.pot_id.trim() === '') {
        throw new BadRequestException('Pot ID is required');
      }

      const device = await this.deviceRepository.findByLinkingKey(dto.linking_key);
      if (!device) {
        throw new NotFoundException('Device not found with the provided linking key');
      }

      if (device.status !== DeviceStatus.AVAILABLE) {
        throw new BadRequestException('Device is not available for linking');
      }

      const pot = await this.potsRepository.findById(dto.pot_id);
      if (!pot) {
        throw new NotFoundException('Pot not found');
      }

      if (pot.user_id !== userId) {
        throw new BadRequestException('Pot does not belong to the user');
      }

      if (pot.device_id) {
        throw new BadRequestException('Pot already has a device linked');
      }

      const updatedDevice = await this.deviceRepository.update(device.id, {
        status: DeviceStatus.LINKED,
        linked_at: new Date()
      });

      await this.potsRepository.updateDevice(pot.id, { device_id: device.id });

      return plainToInstance(CreateDeviceResponseDto, {
        id: updatedDevice.id
      }, { excludeExtraneousValues: true });
    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while linking the device');
    }
  }
}