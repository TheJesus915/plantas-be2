import { Injectable, Inject, Logger } from '@nestjs/common';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';
import { Cron } from '@nestjs/schedule';
import { IDeviceControlService } from '../../domain/interfaces/device-control-service.interface';
import { IWateringNotificationService } from '../../domain/interfaces/watering-notification-service.interface';
import { WateringScheduleMapper } from '../../infrastructure/mappers/watering-schedule.mapper';
import { WateringGroupMapper } from '../../infrastructure/mappers/watering-group.mapper';

interface ActiveScheduleRecord {
  scheduleId: string;
  startTime: string;
  endTime: string;
  activatedAt: Date;
}

@Injectable()
export class ExecuteWateringScheduleUseCase {
  private readonly logger = new Logger(ExecuteWateringScheduleUseCase.name);
  private activeSchedules: Map<string, ActiveScheduleRecord> = new Map();

  constructor(
    @Inject('IWateringRepository')
    private readonly wateringRepository: IWateringRepository,
    @Inject('IDeviceControlService')
    private readonly deviceControlService: IDeviceControlService,
    @Inject('IWateringNotificationService')
    private readonly notificationService: IWateringNotificationService,
    private readonly scheduleMapper: WateringScheduleMapper,
    private readonly groupMapper: WateringGroupMapper
  ) {}

  removeActiveSchedule(scheduleId: string): void {
    if (this.activeSchedules.has(scheduleId)) {
      this.activeSchedules.delete(scheduleId);
    }
  }

  isScheduleActive(scheduleId: string): boolean {
    return this.activeSchedules.has(scheduleId);
  }

  @Cron('0 * * * * *')
  async execute(): Promise<void> {
    try {
      const currentDate = new Date();
      const currentDay = this.getCurrentDay(currentDate);
      const currentTime = this.formatTime(currentDate);

      this.logger.log(`Checking watering schedules for day: ${currentDay}, time: ${currentTime}`);

      this.cleanupExpiredSchedules(currentTime);

      const activeSchedules = await this.wateringRepository.findActiveSchedules(currentDay, currentTime);
      for (const { schedule, group, potIds } of activeSchedules) {
        const mappedSchedule = this.scheduleMapper.toDomain(schedule);
        const mappedGroup = this.groupMapper.toDomain(group);

        if (this.activeSchedules.has(mappedSchedule.id)) {
          continue;
        }

        if (potIds.length === 0) {
          continue;
        }
        this.activeSchedules.set(mappedSchedule.id, {
          scheduleId: mappedSchedule.id,
          startTime: mappedSchedule.startTime,
          endTime: mappedSchedule.endTime,
          activatedAt: new Date()
        });

        for (const potId of potIds) {
          const { hasDevice, deviceId } = await this.wateringRepository.checkPotHasDevice(potId);

          if (!hasDevice) {
            continue;
          }

          if (hasDevice && deviceId) {
            try {
              await this.deviceControlService.activateWatering(deviceId);
              await this.notificationService.sendWateringNotification(
                mappedGroup.userId,
                mappedGroup.name,
                potId,
                mappedSchedule.startTime,
                mappedSchedule.endTime
              );
            } catch (error) {
              this.logger.error(`Error activating watering for device ${deviceId}: ${error.message}`);

              await this.notificationService.sendWateringErrorNotification(
                mappedGroup.userId,
                mappedGroup.name,
                potId,
                error.message
              );
            }
          }
        }
      }

      const scheduleEndingNow = await this.wateringRepository.findActiveSchedules(currentDay, currentTime, true);

      for (const { schedule, group, potIds } of scheduleEndingNow) {
        const scheduleId = schedule.id;
        if (this.activeSchedules.has(scheduleId)) {
          this.activeSchedules.delete(scheduleId);
        }

        for (const potId of potIds) {
          const { hasDevice, deviceId } = await this.wateringRepository.checkPotHasDevice(potId);

          if (hasDevice && deviceId) {
            try {
              await this.deviceControlService.deactivateWatering(deviceId);
            } catch (error) {
              this.logger.error(`Error deactivating watering for device ${deviceId}: ${error.message}`);
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error executing watering schedules: ${error.message}`);
    }
  }

  private cleanupExpiredSchedules(currentTime: string): void {
    const currentMinutes = this.timeToMinutes(currentTime);

    for (const [id, record] of this.activeSchedules.entries()) {
      const endTimeMinutes = this.timeToMinutes(record.endTime);
      if (currentMinutes > endTimeMinutes) {
        this.activeSchedules.delete(id);
      }
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 60) + minutes + (seconds / 60);
  }

  private getCurrentDay(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}