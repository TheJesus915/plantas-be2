import { Injectable } from '@nestjs/common';
import { LightingGroup } from '../../domain/entities/lighting-group.entity';

@Injectable()
export class LightingGroupMapper {
  toDomain(prismaLightingGroup: any): LightingGroup {
    return {
      id: prismaLightingGroup.id,
      userId: prismaLightingGroup.user_id,
      name: prismaLightingGroup.name,
      description: prismaLightingGroup.description || null,
      imageUrl: prismaLightingGroup.image_url || null,
      pots: prismaLightingGroup.pots?.map(pot => pot.id) || [],
      schedules: prismaLightingGroup.schedules?.map(schedule => schedule.id) || []
    };
  }

  toDetailedDto(prismaLightingGroup: any): any {
    const schedules = prismaLightingGroup.schedules;
    const nextLightingDate = this.calculateNextLightingDate(schedules);

    return {
      id: prismaLightingGroup.id,
      name: prismaLightingGroup.name,
      description: prismaLightingGroup.description,
      imageUrl: prismaLightingGroup.image_url,
      userId: prismaLightingGroup.user_id,
      pots: prismaLightingGroup.pots.map(pot => ({
        id: pot.id,
        name: pot.name,
        imageUrl: pot.image_url,
        hasDevice: !!pot.device_id
      })),
      schedules: schedules.map(schedule => ({
        id: schedule.id,
        name: schedule.name,
        days: schedule.days,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        lightType: schedule.light_type,
        lightColor: schedule.light_color
      })),
      nextLighting: nextLightingDate ? {
        date: nextLightingDate.date.toISOString().split('T')[0],
        time: nextLightingDate.time,
        scheduleName: nextLightingDate.scheduleName,
        lightType: nextLightingDate.lightType,
        lightColor: nextLightingDate.lightColor
      } : null
    };
  }

  private calculateNextLightingDate(schedules: any[]): {
    date: Date;
    time: string;
    scheduleName: string;
    lightType: string;
    lightColor: string;
  } | null {
    if (!schedules || schedules.length === 0) return null;

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    const currentDay = daysOfWeek[today.getDay()];

    const currentHour = today.getHours().toString().padStart(2, '0');
    const currentMinute = today.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;

    let closestSchedule: any = null;
    let closestDate: Date | null = null;
    let minDiff = Number.MAX_SAFE_INTEGER;

    for (const schedule of schedules) {
      const scheduleDays = Array.isArray(schedule.days) ? schedule.days :
                          (typeof schedule.days === 'object' ? Object.values(schedule.days) : []);

      for (const day of scheduleDays) {
        const daysUntil = this.calculateDaysUntil(currentDay, day);
        const scheduleDate = new Date();
        scheduleDate.setDate(today.getDate() + daysUntil);

        if (daysUntil === 0 && schedule.start_time < currentTime) {
          scheduleDate.setDate(scheduleDate.getDate() + 7);
        }

        const diffInDays = (scheduleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

        if (diffInDays < minDiff) {
          minDiff = diffInDays;
          closestSchedule = schedule;
          closestDate = scheduleDate;
        }
      }
    }

    if (closestSchedule && closestDate) {
      return {
        date: closestDate,
        time: closestSchedule.start_time,
        scheduleName: closestSchedule.name,
        lightType: closestSchedule.light_type,
        lightColor: closestSchedule.light_color
      };
    }

    return null;
  }

  private calculateDaysUntil(currentDay: string, targetDay: string): number {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentIndex = daysOfWeek.indexOf(currentDay);
    const targetIndex = daysOfWeek.indexOf(targetDay);

    if (currentIndex === -1 || targetIndex === -1) {
      return 0;
    }

    let daysUntil = targetIndex - currentIndex;
    if (daysUntil < 0) {
      daysUntil += 7;
    }

    return daysUntil;
  }
}
