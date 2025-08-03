import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { ManualLightingControlDto } from '../dtos/manual-lighting-control.dto';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';
import { ILightingNotificationService } from '../../domain/interfaces/lighting-notification-service.interface';
import { IDeviceControlService } from '../../domain/interfaces/device-control-service.interface';

@Injectable()
export class ManualLightingControlUseCase {
  constructor(
    @Inject('ILightingRepository')
    private readonly ILightingRepository: ILightingRepository,
    @Inject('ILightingNotificationService')
    private readonly notificationService: ILightingNotificationService,
    @Inject('IDeviceControlService')
    private readonly deviceControlService: IDeviceControlService,
  ) {}

  async execute(userId: string, dto: ManualLightingControlDto): Promise<void> {
    const { potId, activate } = dto;

    const belongs = await this.ILightingRepository.checkPotBelongsToUser(potId, userId);
    if (!belongs) {
      throw new ConflictException(`Pot with id ${potId} not found or doesn't belong to the user`);
    }

    const { hasDevice, deviceId } = await this.ILightingRepository.checkPotHasDevice(potId);

    if (!hasDevice || !deviceId) {
      throw new NotFoundException('No device associated with the specified pot');
    }

    if (activate) {
      await this.deviceControlService.activateLighting(deviceId, 'MANUAL', 'WHITE');
    } else {
      await this.deviceControlService.deactivateLighting(deviceId);
    }
  }
}