import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { ManualWateringControlDto } from '../dtos/manual-watering-control.dto';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';
import { IWateringNotificationService } from '../../domain/interfaces/watering-notification-service.interface';
import { IDeviceControlService } from '../../domain/interfaces/device-control-service.interface';

@Injectable()
export class ManualWateringControlUseCase {
  constructor(
    @Inject('IWateringRepository')
    private readonly IWateringRepository: IWateringRepository,
    @Inject('IWateringNotificationService')
    private readonly notificationService: IWateringNotificationService,
    @Inject('IDeviceControlService')
    private readonly deviceControlService: IDeviceControlService,
  ) {}

  async execute(userId: string, dto: ManualWateringControlDto): Promise<void> {
    const { potId, activate } = dto;

    const belongs = await this.IWateringRepository.checkPotBelongsToUser(potId, userId);
    if (!belongs) {
      throw new ConflictException(`Pot with id ${potId} not found or doesn't belong to the user`);
    }

    const { hasDevice, deviceId } = await this.IWateringRepository.checkPotHasDevice(potId);

    if (!hasDevice || !deviceId) {
      throw new NotFoundException('No device associated with the specified pot');
    }

    if (activate) {
      await this.deviceControlService.activateWatering(deviceId);
    } else {
      await this.deviceControlService.deactivateWatering(deviceId);
    }
  }
}