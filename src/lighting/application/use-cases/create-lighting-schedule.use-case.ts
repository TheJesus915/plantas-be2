import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';
import { CreateLightingScheduleDto } from '../dtos/create-lighting-schedule.dto';
import { LightingSchedule } from '../../domain/entities/lighting-schedule.entity';

@Injectable()
export class CreateLightingScheduleUseCase {
  constructor(
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository
  ) {}

  async execute(userId: string, groupId: string, dto: CreateLightingScheduleDto): Promise<string> {
    const group = await this.lightingRepository.findLightingGroupById(groupId);
    if (!group) {
      throw new NotFoundException('Lighting group not found');
    }

    if (group.user_id !== userId) {
      throw new NotFoundException('Lighting group not found');
    }

    const hasOverlap = await this.lightingRepository.checkSchedulesOverlap(
      groupId,
      dto.days,
      dto.startTime,
      dto.endTime
    );

    if (hasOverlap) {
      throw new ConflictException('The new schedule overlaps with an existing schedule for some of these pots');
    }

    const schedule = {
      lightingGroupId: groupId,
      name: dto.name,
      days: dto.days,
      startTime: dto.startTime,
      endTime: dto.endTime,
      lightType: dto.lightType,
      lightColor: dto.lightColor
    } as LightingSchedule;

    return this.lightingRepository.createLightingSchedule(schedule);
  }
}
