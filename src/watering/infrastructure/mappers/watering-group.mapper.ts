import { Injectable } from '@nestjs/common';
import { WateringGroup } from '../../domain/entities/watering-group.entity';

@Injectable()
export class WateringGroupMapper {
  toDomain(prismaWateringGroup: any): WateringGroup {
    return {
      id: prismaWateringGroup.id,
      userId: prismaWateringGroup.user_id,
      name: prismaWateringGroup.name,
      description: prismaWateringGroup.description || null,
      imageUrl: prismaWateringGroup.image_url || null,
      pots: prismaWateringGroup.pots?.map(pot => pot.id) || [],
      schedules: prismaWateringGroup.schedules?.map(schedule => schedule.id) || []
    };
  }

  toDetailedDto(prismaWateringGroup: any): any {
    const schedules = prismaWateringGroup.schedules;
    const nextWateringDate = this.calculateNextWateringDate(schedules);

    return {
      id: prismaWateringGroup.id,
      name: prismaWateringGroup.name,
      description: prismaWateringGroup.description,
      imageUrl: prismaWateringGroup.image_url,
      userId: prismaWateringGroup.user_id,
      pots: prismaWateringGroup.pots.map(pot => ({
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
        endTime: schedule.end_time
      })),
      nextWatering: nextWateringDate ? {
        date: nextWateringDate.date.toISOString().split('T')[0],
        time: nextWateringDate.time,
        scheduleName: nextWateringDate.scheduleName
      } : null
    };
  }

  private calculateNextWateringDate(schedules: any[]): { date: Date; time: string; scheduleName: string } | null {
    if (!schedules || schedules.length === 0) return null;

    const today = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentHour = today.getHours().toString().padStart(2, '0');
    const currentMinute = today.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}:00`;

    let nextDate: { date: Date; time: string; scheduleName: string } | null = null;
    let minDaysAway = Infinity;

    for (const schedule of schedules) {
      const days = schedule.days as string[];

      for (let dayDiff = 0; dayDiff < 7; dayDiff++) {
        const checkDate = new Date();
        checkDate.setDate(today.getDate() + dayDiff);
        const checkDayName = dayNames[checkDate.getDay()];

        if (days.includes(checkDayName)) {
          if (dayDiff === 0 && schedule.start_time <= currentTime) {
            continue;
          }

          if (dayDiff < minDaysAway) {
            minDaysAway = dayDiff;
            nextDate = {
              date: checkDate,
              time: schedule.start_time,
              scheduleName: schedule.name
            };
            break;
          }
        }
      }
    }

    return nextDate;
  }
}
