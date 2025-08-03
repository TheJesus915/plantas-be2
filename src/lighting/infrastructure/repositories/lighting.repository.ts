import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';
import { LightingGroup } from '../../domain/entities/lighting-group.entity';
import { LightingSchedule } from '../../domain/entities/lighting-schedule.entity';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

@Injectable()
export class LightingRepository implements ILightingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createLightingGroup(lightingGroup: LightingGroup): Promise<string> {
    const result = await this.prisma.lightingGroup.create({
      data: {
        name: lightingGroup.name,
        description: lightingGroup.description || '',
        image_url: lightingGroup.imageUrl || '',
        user_id: lightingGroup.userId
      }
    });
    return result.id;
  }

  async updateLightingGroup(id: string, lightingGroup: Partial<LightingGroup>): Promise<string> {
    await this.prisma.lightingGroup.update({
      where: { id },
      data: {
        name: lightingGroup.name,
        description: lightingGroup.description,
        image_url: lightingGroup.imageUrl
      }
    });
    return id;
  }

  async findLightingGroupById(id: string): Promise<any> {
    const group = await this.prisma.lightingGroup.findUnique({
      where: { id },
      include: {
        pots: true,
        schedules: true
      }
    });
    return group;
  }

  async findAllLightingGroupsPaginated(userId: string, filter: PaginationFilterDto): Promise<{ data: any[]; totalItems: number }> {
    const { page = 1, limit = 10, search = '' } = filter;
    const skip = (page - 1) * limit;

    const where = {
      user_id: userId,
      ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {})
    };

    const [groups, totalItems] = await Promise.all([
      this.prisma.lightingGroup.findMany({
        where,
        skip,
        take: limit,
        include: {
          schedules: true,
          pots: {
            select: {
              id: true,
              name: true,
              image_url: true,
              device_id: true
            }
          }
        }
      }),
      this.prisma.lightingGroup.count({ where })
    ]);

    return {
      data: groups,
      totalItems
    };
  }

  async deleteLightingGroup(id: string): Promise<void> {
    await this.prisma.lightingGroup.delete({
      where: { id }
    });
  }

  async addPotToGroup(groupId: string, potId: string): Promise<void> {
    await this.prisma.lightingGroup.update({
      where: { id: groupId },
      data: {
        pots: {
          connect: { id: potId }
        }
      }
    });
  }

  async removePotFromGroup(groupId: string, potId: string): Promise<void> {
    await this.prisma.lightingGroup.update({
      where: { id: groupId },
      data: {
        pots: {
          disconnect: { id: potId }
        }
      }
    });
  }

  async findAllPotsByGroupId(groupId: string): Promise<{ id: string; name: string }[]> {
    const group = await this.prisma.lightingGroup.findUnique({
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

  async createLightingSchedule(schedule: LightingSchedule): Promise<string> {
    const result = await this.prisma.lightingSchedule.create({
      data: {
        lighting_group_id: schedule.lightingGroupId,
        name: schedule.name,
        days: schedule.days,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        light_type: schedule.lightType,
        light_color: schedule.lightColor
      }
    });
    return result.id;
  }

  async updateLightingSchedule(id: string, schedule: Partial<LightingSchedule>): Promise<string> {
    await this.prisma.lightingSchedule.update({
      where: { id },
      data: {
        name: schedule.name,
        days: schedule.days,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        light_type: schedule.lightType,
        light_color: schedule.lightColor
      }
    });
    return id;
  }

  async findAllSchedulesByGroup(groupId: string): Promise<any[]> {
    const schedules = await this.prisma.lightingSchedule.findMany({
      where: { lighting_group_id: groupId }
    });
    return schedules;
  }

  async findScheduleById(id: string): Promise<any> {
    return this.prisma.lightingSchedule.findUnique({
      where: { id }
    });
  }

  async deleteSchedule(id: string): Promise<void> {
    await this.prisma.lightingSchedule.delete({
      where: { id }
    });
  }

  async findActiveSchedules(day: string, currentTime: string, findEnding = false): Promise<{ schedule: any; group: any; potIds: string[] }[]> {
    try {
      const allSchedules = await this.prisma.lightingSchedule.findMany({
        include: {
          lighting_group: {
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
          const group = schedule.lighting_group;
          const potIds = group.pots.map(pot => pot.id);
          return {
            schedule: {
              id: schedule.id,
              name: schedule.name,
              days: schedule.days,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              lighting_group_id: schedule.lighting_group_id,
              light_type: schedule.light_type,
              light_color: schedule.light_color
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
    const pot = await this.prisma.pot.findFirst({
      where: {
        id: potId,
        user_id: userId
      }
    });
    return !!pot;
  }

  async checkPotHasDevice(potId: string): Promise<{ hasDevice: boolean; deviceId?: string }> {
    const pot = await this.prisma.pot.findUnique({
      where: { id: potId },
      select: { device_id: true }
    });

    if (!pot) return { hasDevice: false };

    return {
      hasDevice: !!pot.device_id,
      deviceId: pot.device_id || undefined
    };
  }

  async checkSchedulesOverlap(
    groupId: string,
    days: string[],
    startTime: string,
    endTime: string,
    excludeScheduleId?: string
  ): Promise<boolean> {
    const group = await this.prisma.lightingGroup.findUnique({
      where: { id: groupId },
      include: { pots: { select: { id: true } } }
    });

    if (!group || !group.pots || group.pots.length === 0) return false;
    const potIds = group.pots.map(pot => pot.id);
    const otherGroups = await this.prisma.lightingGroup.findMany({
      where: {
        id: { not: groupId },
        pots: { some: { id: { in: potIds } } }
      },
      include: {
        schedules: {
          where: excludeScheduleId
            ? { id: { not: excludeScheduleId } }
            : {}
        }
      }
    });

    const currentGroupSchedules = excludeScheduleId
      ? await this.prisma.lightingSchedule.findMany({
          where: {
            lighting_group_id: groupId,
            id: { not: excludeScheduleId }
          }
        })
      : await this.prisma.lightingSchedule.findMany({
          where: { lighting_group_id: groupId }
        });

    const allSchedulesToCheck = [
      ...currentGroupSchedules,
      ...otherGroups.flatMap(g => g.schedules)
    ];

    const newStartMinutes = this.timeToMinutes(startTime);
    const newEndMinutes = this.timeToMinutes(endTime);

    for (const schedule of allSchedulesToCheck) {
      let scheduleDays: string[] = [];

      if (Array.isArray(schedule.days)) {
        scheduleDays = schedule.days.map(day => String(day));
      } else if (schedule.days && typeof schedule.days === 'object') {
        try {
          const values = Object.values(schedule.days);
          scheduleDays = values
            .filter(val => val !== null && val !== undefined)
            .map(val => String(val));
        } catch (error) {
          console.error('Error parsing schedule days:', error);
        }
      }

      const hasCommonDays = days.some(day => scheduleDays.includes(day));

      if (!hasCommonDays) continue;
      const schedStartMinutes = this.timeToMinutes(schedule.start_time);
      const schedEndMinutes = this.timeToMinutes(schedule.end_time);

      if (
        (newStartMinutes >= schedStartMinutes && newStartMinutes < schedEndMinutes) ||
        (newEndMinutes > schedStartMinutes && newEndMinutes <= schedEndMinutes) ||
        (newStartMinutes <= schedStartMinutes && newEndMinutes >= schedEndMinutes)
      ) {
        return true;
      }
    }

    return false;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  async checkExistingGroupByName(userId: string, name: string): Promise<boolean> {
    const group = await this.prisma.lightingGroup.findFirst({
      where: {
        user_id: userId,
        name: { equals: name, mode: 'insensitive' }
      }
    });
    return !!group;
  }

  async checkUserExists(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    return !!user;
  }

  async checkPotInGroup(groupId: string, potId: string): Promise<boolean> {
    const group = await this.prisma.lightingGroup.findUnique({
      where: { id: groupId },
      include: {
        pots: {
          where: { id: potId },
          select: { id: true }
        }
      }
    });

    return group !== null && group.pots !== null && group.pots.length > 0;
  }

  async checkPotInAnotherGroup(potId: string, excludeGroupId?: string): Promise<{ inGroup: boolean; groupName?: string }> {
    const otherGroup = await this.prisma.lightingGroup.findFirst({
      where: {
        ...(excludeGroupId ? { id: { not: excludeGroupId } } : {}),
        pots: { some: { id: potId } }
      },
      select: { id: true, name: true }
    });

    return {
      inGroup: !!otherGroup,
      groupName: otherGroup?.name
    };
  }
}
