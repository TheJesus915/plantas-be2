import { Injectable } from '@nestjs/common';
import { LightingSchedule, LightType } from '../../domain/entities/lighting-schedule.entity';

@Injectable()
export class LightingScheduleMapper {
  toDomain(prismaLightingSchedule: any): LightingSchedule {
    return {
      id: prismaLightingSchedule.id,
      lightingGroupId: prismaLightingSchedule.lighting_group_id,
      name: prismaLightingSchedule.name,
      days: prismaLightingSchedule.days as string[],
      startTime: prismaLightingSchedule.start_time,
      endTime: prismaLightingSchedule.end_time,
      lightType: prismaLightingSchedule.light_type as LightType,
      lightColor: prismaLightingSchedule.light_color
    };
  }
}
