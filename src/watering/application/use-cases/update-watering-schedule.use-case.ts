import { Injectable, Inject, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';
import { UpdateWateringScheduleDto } from '../dtos/update-watering-schedule.dto';
import { WateringSchedule } from '../../domain/entities/watering-schedule.entity';
import { IDeviceControlService } from '../../domain/interfaces/device-control-service.interface';
import { ExecuteWateringScheduleUseCase } from './execute-watering-schedule.use-case';

@Injectable()
export class UpdateWateringScheduleUseCase {
  private readonly logger = new Logger(UpdateWateringScheduleUseCase.name);

  constructor(
    @Inject('IWateringRepository')
    private readonly wateringRepository: IWateringRepository,
    @Inject('IDeviceControlService')
    private readonly deviceControlService: IDeviceControlService,
    private readonly executeWateringScheduleUseCase: ExecuteWateringScheduleUseCase
  ) {}

  async execute(userId: string, scheduleId: string, dto: UpdateWateringScheduleDto): Promise<string> {
    try {
      const schedule = await this.wateringRepository.findScheduleById(scheduleId);
      if (!schedule) {
        throw new NotFoundException('Watering schedule not found');
      }

      if (!schedule.watering_group_id) {
        throw new BadRequestException('Invalid watering group ID');
      }

      const group = await this.wateringRepository.findWateringGroupById(schedule.watering_group_id);
      if (!group || group.user_id !== userId) {
        throw new NotFoundException('Watering schedule not found');
      }

      if ((dto.days && dto.days.length > 0) || dto.startTime || dto.endTime) {
        const daysToCheck = dto.days || schedule.days;
        const startTimeToCheck = dto.startTime || schedule.start_time;
        const endTimeToCheck = dto.endTime || schedule.end_time;

        try {
          const overlaps = await this.wateringRepository.checkSchedulesOverlap(
            schedule.watering_group_id,
            daysToCheck,
            startTimeToCheck,
            endTimeToCheck,
            scheduleId
          );

          if (overlaps) {
            throw new ConflictException('The schedule overlaps with an existing schedule');
          }
        } catch (error) {
          throw new BadRequestException('Failed to check schedule overlap. Please verify the format of days and times.');
        }
      }

      try {
        const pots = await this.wateringRepository.findAllPotsByGroupId(schedule.watering_group_id);
        for (const pot of pots) {
          const { hasDevice, deviceId } = await this.wateringRepository.checkPotHasDevice(pot.id);

          if (hasDevice && deviceId) {
            try {
              await this.deviceControlService.deactivateWatering(deviceId);
            } catch (deactivateError) {
              this.logger.error(`Error deactivating watering for device ${deviceId}: ${deactivateError.message}`);
            }
          }
        }

        this.executeWateringScheduleUseCase.removeActiveSchedule(scheduleId);

      } catch (potsError) {
        this.logger.error(`Error retrieving pots for group ${schedule.watering_group_id}: ${potsError.message}`);
      }

      const updatedSchedule: Partial<WateringSchedule> = {};

      if (dto.name) updatedSchedule.name = dto.name;
      if (dto.days) updatedSchedule.days = dto.days;
      if (dto.startTime) updatedSchedule.startTime = dto.startTime;
      if (dto.endTime) updatedSchedule.endTime = dto.endTime;

      return this.wateringRepository.updateWateringSchedule(scheduleId, updatedSchedule);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update watering schedule: ' + error.message);
    }
  }
}
