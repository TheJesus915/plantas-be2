import { LightingGroup } from '../entities/lighting-group.entity';
import { LightingSchedule } from '../entities/lighting-schedule.entity';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

export interface ILightingRepository {
  createLightingGroup(lightingGroup: LightingGroup): Promise<string>;
  updateLightingGroup(id: string, lightingGroup: Partial<LightingGroup>): Promise<string>;
  findLightingGroupById(id: string): Promise<any>;
  findAllLightingGroupsPaginated(userId: string, filter: PaginationFilterDto): Promise<{ data: any[]; totalItems: number }>;
  deleteLightingGroup(id: string): Promise<void>;
  addPotToGroup(groupId: string, potId: string): Promise<void>;
  removePotFromGroup(groupId: string, potId: string): Promise<void>;
  findAllPotsByGroupId(groupId: string): Promise<{ id: string; name: string }[]>;
  createLightingSchedule(schedule: LightingSchedule): Promise<string>;
  updateLightingSchedule(id: string, schedule: Partial<LightingSchedule>): Promise<string>;
  findAllSchedulesByGroup(groupId: string): Promise<any[]>;
  findScheduleById(id: string): Promise<any>;
  deleteSchedule(id: string): Promise<void>;
  findActiveSchedules(day: string, currentTime: string, findEnding?: boolean): Promise<{ schedule: any; group: any; potIds: string[] }[]>;
  checkPotBelongsToUser(potId: string, userId: string): Promise<boolean>;
  checkPotHasDevice(potId: string): Promise<{ hasDevice: boolean; deviceId?: string }>;
  checkSchedulesOverlap(groupId: string, days: string[], startTime: string, endTime: string, excludeScheduleId?: string): Promise<boolean>;
  checkExistingGroupByName(userId: string, name: string): Promise<boolean>;
  checkUserExists(userId: string): Promise<boolean>;
  checkPotInGroup(groupId: string, potId: string): Promise<boolean>;
  checkPotInAnotherGroup(potId: string, excludeGroupId?: string): Promise<{ inGroup: boolean; groupName?: string }>;
}
