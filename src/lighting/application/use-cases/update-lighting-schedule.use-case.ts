import { Injectable, Inject, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';
import { UpdateLightingScheduleDto } from '../dtos/update-lighting-schedule.dto';
import { LightingSchedule } from '../../domain/entities/lighting-schedule.entity';
import { IDeviceControlService } from '../../domain/interfaces/device-control-service.interface';

@Injectable()
export class UpdateLightingScheduleUseCase {
  private readonly logger = new Logger(UpdateLightingScheduleUseCase.name);

  constructor(
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository,
    @Inject('IDeviceControlService')
    private readonly deviceControlService: IDeviceControlService
  ) {}

  async execute(userId: string, scheduleId: string, dto: UpdateLightingScheduleDto): Promise<string> {
    try {
      const schedule = await this.lightingRepository.findScheduleById(scheduleId);
      if (!schedule) {
        throw new NotFoundException('Lighting schedule not found');
      }

      if (!schedule.lighting_group_id) {
        throw new BadRequestException('Invalid lighting group ID');
      }

      const group = await this.lightingRepository.findLightingGroupById(schedule.lighting_group_id);
      if (!group || group.user_id !== userId) {
        throw new NotFoundException('Lighting schedule not found');
      }

      if ((dto.days && dto.days.length > 0) || dto.startTime || dto.endTime) {
        const daysToCheck = dto.days || schedule.days;
        const startTimeToCheck = dto.startTime || schedule.start_time;
        const endTimeToCheck = dto.endTime || schedule.end_time;

        try {
          const overlaps = await this.lightingRepository.checkSchedulesOverlap(
            schedule.lighting_group_id,
            daysToCheck,
            startTimeToCheck,
            endTimeToCheck,
            scheduleId
          );

          if (overlaps) {
            throw new ConflictException('The schedule overlaps with an existing schedule');
          }
        } catch (error) {
          if (error instanceof ConflictException) {
            throw error;
          }
          this.logger.error(`Error checking schedule overlap: ${error.message}`);
          throw new ConflictException('Could not validate schedule overlap');
        }
      }

      const updatedSchedule: Partial<LightingSchedule> = {};

      if (dto.name) updatedSchedule.name = dto.name;
      if (dto.days) updatedSchedule.days = dto.days;
      if (dto.startTime) updatedSchedule.startTime = dto.startTime;
      if (dto.endTime) updatedSchedule.endTime = dto.endTime;
      if (dto.lightType) updatedSchedule.lightType = dto.lightType;
      if (dto.lightColor) updatedSchedule.lightColor = dto.lightColor;

      return this.lightingRepository.updateLightingSchedule(scheduleId, updatedSchedule);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.logger.error(`Failed to update lighting schedule: ${error.message}`);
      throw new ConflictException('Failed to update lighting schedule');
    }
  }
}
