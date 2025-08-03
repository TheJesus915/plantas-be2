import { Injectable, Inject, Logger } from '@nestjs/common';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';
import { Cron } from '@nestjs/schedule';
import { IDeviceControlService } from '../../domain/interfaces/device-control-service.interface';
import { ILightingNotificationService } from '../../domain/interfaces/lighting-notification-service.interface';
import { LightingScheduleMapper } from '../../infrastructure/mappers/lighting-schedule.mapper';
import { LightingGroupMapper } from '../../infrastructure/mappers/lighting-group.mapper';

interface ActiveScheduleRecord {
  scheduleId: string;
  startTime: string;
  endTime: string;
  lightType: string;
  lightColor: string;
  activatedAt: Date;
}

@Injectable()
export class ExecuteLightingScheduleUseCase {
  private readonly logger = new Logger(ExecuteLightingScheduleUseCase.name);
  private activeSchedules: Map<string, ActiveScheduleRecord> = new Map();

  constructor(
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository,
    @Inject('IDeviceControlService')
    private readonly deviceControlService: IDeviceControlService,
    @Inject('ILightingNotificationService')
    private readonly notificationService: ILightingNotificationService,
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

      this.logger.log(`Checking lighting schedules for day: ${currentDay}, time: ${currentTime}`);

      this.cleanupExpiredSchedules(currentTime);

      await this.startLightingForSchedules(currentDay, currentTime);

      await this.endLightingForSchedules(currentDay, currentTime);
    } catch (error) {
      this.logger.error(`Error executing lighting schedules: ${error.message}`);
    }
  }

  private async startLightingForSchedules(day: string, currentTime: string): Promise<void> {
    try {
      const startingSchedules = await this.lightingRepository.findActiveSchedules(day, currentTime);

      for (const { schedule, group, potIds } of startingSchedules) {
        if (this.activeSchedules.has(schedule.id)) {
          continue;
        }
        this.activeSchedules.set(schedule.id, {
          scheduleId: schedule.id,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          lightType: schedule.light_type,
          lightColor: schedule.light_color,
          activatedAt: new Date()
        });

        for (const potId of potIds) {
          try {
            const { hasDevice, deviceId } = await this.lightingRepository.checkPotHasDevice(potId);
            if (!hasDevice || !deviceId) {
              continue;
            }

            await this.deviceControlService.activateLighting(deviceId, schedule.light_type, schedule.light_color);

            await this.notificationService.sendLightingNotification(
              group.user_id,
              group.name,
              potId,
              schedule.light_type,
              schedule.light_color,
              schedule.start_time,
              schedule.end_time
            );
          } catch (error) {
            this.logger.error(
              `Error activating lighting for pot ${potId} in schedule ${schedule.id}: ${error.message}`
            );

            await this.notificationService.sendLightingErrorNotification(
              group.user_id,
              group.name,
              potId,
              `Error activating lighting: ${error.message}`
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error starting lighting for schedules: ${error.message}`);
    }
  }

  private async endLightingForSchedules(day: string, currentTime: string): Promise<void> {
    try {
      const endingSchedules = await this.lightingRepository.findActiveSchedules(day, currentTime, true);

      for (const { schedule, group, potIds } of endingSchedules) {

        this.removeActiveSchedule(schedule.id);

        for (const potId of potIds) {
          try {
            const { hasDevice, deviceId } = await this.lightingRepository.checkPotHasDevice(potId);
            if (!hasDevice || !deviceId) {
              continue;
            }

            await this.deviceControlService.deactivateLighting(deviceId);
          } catch (error) {
            this.logger.error(
              `Error deactivating lighting for pot ${potId} in schedule ${schedule.id}: ${error.message}`
            );

            await this.notificationService.sendLightingErrorNotification(
              group.user_id,
              group.name,
              potId,
              `Error deactivating lighting: ${error.message}`
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error ending lighting for schedules: ${error.message}`);
    }
  }

  private cleanupExpiredSchedules(currentTime: string): void {
    for (const [scheduleId, record] of this.activeSchedules.entries()) {
      const activeDuration = Date.now() - record.activatedAt.getTime();
      if (activeDuration > 24 * 60 * 60 * 1000) {
        this.activeSchedules.delete(scheduleId);
      }
      if (this.isTimePast(currentTime, record.endTime)) {
        this.activeSchedules.delete(scheduleId);
      }
    }
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

  private isTimePast(currentTime: string, targetTime: string): boolean {
    const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
    const [targetHours, targetMinutes] = targetTime.split(':').map(Number);

    if (currentHours > targetHours) {
      return true;
    }

    if (currentHours === targetHours && currentMinutes > targetMinutes) {
      return true;
    }

    return false;
  }
}