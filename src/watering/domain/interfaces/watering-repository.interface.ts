import { WateringGroup } from '../entities/watering-group.entity';
import { WateringSchedule } from '../entities/watering-schedule.entity';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

export interface IWateringRepository {
  createWateringGroup(wateringGroup: WateringGroup): Promise<string>;
  updateWateringGroup(id: string, wateringGroup: Partial<WateringGroup>): Promise<string>;
  findWateringGroupById(id: string): Promise<any>;
  findAllWateringGroupsPaginated(userId: string, filter: PaginationFilterDto): Promise<{ data: any[]; totalItems: number }>;
  deleteWateringGroup(id: string): Promise<void>;
  addPotToGroup(groupId: string, potId: string): Promise<void>;
  removePotFromGroup(groupId: string, potId: string): Promise<void>;
  findAllPotsByGroupId(groupId: string): Promise<{ id: string; name: string }[]>;
  createWateringSchedule(schedule: WateringSchedule): Promise<string>;
  updateWateringSchedule(id: string, schedule: Partial<WateringSchedule>): Promise<string>;
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
}