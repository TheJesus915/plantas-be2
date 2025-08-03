import { Injectable } from '@nestjs/common';
import { WateringSchedule } from '../../domain/entities/watering-schedule.entity';

@Injectable()
export class WateringScheduleMapper {
  toDomain(prismaWateringSchedule: any): WateringSchedule {
    return {
      id: prismaWateringSchedule.id,
      wateringGroupId: prismaWateringSchedule.watering_group_id,
      name: prismaWateringSchedule.name,
      days: prismaWateringSchedule.days as string[],
      startTime: prismaWateringSchedule.start_time,
      endTime: prismaWateringSchedule.end_time
    };
  }
}
