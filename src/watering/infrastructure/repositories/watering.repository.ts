import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';
import { WateringGroup } from '../../domain/entities/watering-group.entity';
import { WateringSchedule } from '../../domain/entities/watering-schedule.entity';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

@Injectable()
export class WateringRepository implements IWateringRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWateringGroup(wateringGroup: WateringGroup): Promise<string> {
    const result = await this.prisma.wateringGroup.create({
      data: {
        name: wateringGroup.name,
        description: wateringGroup.description || '',
        image_url: wateringGroup.imageUrl || '',
        user_id: wateringGroup.userId
      }
    });
    return result.id;
  }


  async updateWateringGroup(id: string, wateringGroup: Partial<WateringGroup>): Promise<string> {
    const updateData: any = {};

    if (wateringGroup.name !== undefined) {
      updateData.name = wateringGroup.name;
    }
    if (wateringGroup.description !== undefined) {
      updateData.description = wateringGroup.description;
    }
    if (wateringGroup.imageUrl !== undefined) {
      updateData.image_url = wateringGroup.imageUrl;
    }

    const result = await this.prisma.wateringGroup.update({
      where: { id },
      data: updateData
    });
    return result.id;
  }

  async findWateringGroupById(id: string): Promise<any> {
    return this.prisma.wateringGroup.findUnique({
      where: { id },
      include: {
        pots: {
          select: {
            id: true,
            name: true,
            image_url: true,
            device_id: true
          }
        },
        schedules: true
      }
    });
  }

  async findAllWateringGroupsPaginated(userId: string, filter: PaginationFilterDto): Promise<{ data: any[]; totalItems: number }> {
    let where: any = { user_id: userId };

    if (filter.search) {
      where = {
        ...where,
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ],
      };
    }

    const totalItems = await this.prisma.wateringGroup.count({ where });

    const skip = (filter.page - 1) * filter.limit;
    const take = filter.limit;

    const orderBy: any = {};
    if (filter.sortBy) {
      orderBy[filter.sortBy] = filter.sortOrder || 'asc';
    } else {
      orderBy.name = 'asc';
    }

    const groups = await this.prisma.wateringGroup.findMany({
      where,
      select: {
        id: true,
        name: true,
        image_url: true,
        user_id: true
      },
      orderBy,
      skip,
      take,
    });

    return { data: groups, totalItems };
  }

  async deleteWateringGroup(id: string): Promise<void> {
    await this.prisma.wateringGroup.delete({ where: { id } });
  }

  async addPotToGroup(groupId: string, potId: string): Promise<void> {
    await this.prisma.wateringGroup.update({
      where: { id: groupId },
      data: { pots: { connect: { id: potId } } }
    });
  }

  async removePotFromGroup(groupId: string, potId: string): Promise<void> {
    await this.prisma.wateringGroup.update({
      where: { id: groupId },
      data: { pots: { disconnect: { id: potId } } }
    });
  }

  async findAllPotsByGroupId(groupId: string): Promise<{ id: string; name: string }[]> {
    const group = await this.prisma.wateringGroup.findUnique({
      where: { id: groupId },
      include: {
        pots: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return group?.pots || [];
  }

  async createWateringSchedule(schedule: WateringSchedule): Promise<string> {
    const result = await this.prisma.wateringSchedule.create({
      data: {
        name: schedule.name,
        days: schedule.days,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        watering_group_id: schedule.wateringGroupId
      }
    });
    return result.id;
  }

  async updateWateringSchedule(id: string, schedule: Partial<WateringSchedule>): Promise<string> {
    const updateData: any = {};

    if (schedule.name !== undefined) {
      updateData.name = schedule.name;
    }
    if (schedule.days !== undefined) {
      updateData.days = schedule.days;
    }
    if (schedule.startTime !== undefined) {
      updateData.start_time = schedule.startTime;
    }
    if (schedule.endTime !== undefined) {
      updateData.end_time = schedule.endTime;
    }

    const result = await this.prisma.wateringSchedule.update({
      where: { id },
      data: updateData
    });
    return result.id;
  }

  async findAllSchedulesByGroup(groupId: string): Promise<any[]> {
    return this.prisma.wateringSchedule.findMany({
      where: { watering_group_id: groupId }
    });
  }

  async findScheduleById(id: string): Promise<any> {
    return this.prisma.wateringSchedule.findUnique({
      where: { id }
    });
  }

  async deleteSchedule(id: string): Promise<void> {
    await this.prisma.wateringSchedule.delete({ where: { id } });
  }

  async findActiveSchedules(day: string, currentTime: string, findEnding = false): Promise<{ schedule: any; group: any; potIds: string[] }[]> {
    try {
      const allSchedules = await this.prisma.wateringSchedule.findMany({
        include: {
          watering_group: {
            include: {
              pots: {
                select: {
                  id: true,
                  device_id: true
                }
              }
            }
          }
        }
      });


      const currentTimeMinutes = this.timeToMinutes(currentTime);

      try {
        const matchingSchedules = allSchedules.filter(schedule => {
          let scheduleDays: string[] = [];
          try {
            if (typeof schedule.days === 'string') {
              scheduleDays = JSON.parse(schedule.days);
            } else if (Array.isArray(schedule.days)) {
              scheduleDays = (schedule.days as any[]).map(day =>
                day !== null && day !== undefined ? String(day) : ''
              ).filter(day => day !== '');
            }
          } catch (e) {
            return false;
          }
          const dayMatch = scheduleDays.some(d =>
            d.toLowerCase() === day.toLowerCase()
          );

          const startTimeMinutes = this.timeToMinutes(schedule.start_time);
          const endTimeMinutes = this.timeToMinutes(schedule.end_time);

          if (findEnding) {
            const isEnding = Math.abs(endTimeMinutes - currentTimeMinutes) < 1;
            if (isEnding) {
              console.log(`Schedule ${schedule.id} is ending now: ${schedule.end_time} ≈ ${currentTime}`);
            }
            return isEnding;
          } else {
            const isActive = (startTimeMinutes <= currentTimeMinutes && currentTimeMinutes < endTimeMinutes);
            if (isActive) {
            } else {
            }
            return isActive;
          }
        });

        const results = await Promise.all(matchingSchedules.map(async (schedule) => {
          const group = schedule.watering_group;
          const potIds = group.pots.map(pot => pot.id);
          return {
            schedule: {
              id: schedule.id,
              name: schedule.name,
              days: schedule.days,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              watering_group_id: schedule.watering_group_id
            },
            group: {
              id: group.id,
              name: group.name,
              description: group.description,
              image_url: group.image_url,
              user_id: group.user_id
            },
            potIds: potIds
          };
        }));

        return results;
      } catch (innerError) {
        console.error('Error processing schedules with Prisma:', innerError);
        return [];
      }
    } catch (error) {
      console.error('Error finding active schedules:', error);
      return [];
    }
  }

  async checkPotBelongsToUser(potId: string, userId: string): Promise<boolean> {
    const count = await this.prisma.pot.count({
      where: { id: potId, user_id: userId }
    });
    return count > 0;
  }

  async checkPotHasDevice(potId: string): Promise<{ hasDevice: boolean; deviceId?: string }> {
    const pot = await this.prisma.pot.findUnique({
      where: { id: potId },
      select: { device_id: true }
    });

    if (!pot || !pot.device_id) {
      return { hasDevice: false };
    }

    return { hasDevice: true, deviceId: pot.device_id };
  }

  async checkSchedulesOverlap(groupId: string, days: string[], startTime: string, endTime: string, excludeScheduleId?: string): Promise<boolean> {
    try {
      const schedules = await this.prisma.wateringSchedule.findMany({
        where: {
          watering_group_id: groupId,
          ...(excludeScheduleId && { id: { not: excludeScheduleId } })
        }
      });
      if (schedules.length === 0) {
        return false;
      }

      const startMinutes = this.timeToMinutes(startTime);
      const endMinutes = this.timeToMinutes(endTime);

      for (const schedule of schedules) {
        const scheduleStartMinutes = this.timeToMinutes(schedule.start_time);
        const scheduleEndMinutes = this.timeToMinutes(schedule.end_time);
        const timeOverlap = (
          (startMinutes >= scheduleStartMinutes && startMinutes < scheduleEndMinutes) ||
          (endMinutes > scheduleStartMinutes && endMinutes <= scheduleEndMinutes) ||
          (startMinutes <= scheduleStartMinutes && endMinutes >= scheduleEndMinutes)
        );
        if (!timeOverlap) {
          continue;
        }
        const scheduleDays = Array.isArray(schedule.days) ? schedule.days : [];
        const dayOverlap = days.some(day => scheduleDays.includes(day));
        if (dayOverlap) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking schedule overlap:', error);
      throw new Error('Failed to check schedule overlap');
    }
  }
  private timeToMinutes(time: string): number {
    try {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return (hours * 60) + minutes + (seconds / 60);
    } catch (error) {
      throw new Error(`Invalid time format: ${time}. Expected format is HH:MM:SS`);
    }
  }

  async checkExistingGroupByName(userId: string, name: string): Promise<boolean> {
    const existingGroup = await this.prisma.wateringGroup.findFirst({
      where: { user_id: userId, name }
    });
    return !!existingGroup;
  }

  async checkUserExists(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    return !!user;
  }

  async checkPotInGroup(groupId: string, potId: string): Promise<boolean> {
    const potInGroup = await this.prisma.wateringGroup.findFirst({
      where: {
        id: groupId,
        pots: { some: { id: potId } }
      }
    });
    return !!potInGroup;
  }
}