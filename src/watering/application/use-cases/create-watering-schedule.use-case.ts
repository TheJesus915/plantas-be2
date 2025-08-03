import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';
import { CreateWateringScheduleDto } from '../dtos/create-watering-schedule.dto';
import { WateringSchedule } from '../../domain/entities/watering-schedule.entity';

@Injectable()
export class CreateWateringScheduleUseCase {
  constructor(
    @Inject('IWateringRepository')
    private readonly wateringRepository: IWateringRepository
  ) {}

  async execute(userId: string, groupId: string, dto: CreateWateringScheduleDto): Promise<string> {
    const group = await this.wateringRepository.findWateringGroupById(groupId);
    if (!group) {
      throw new NotFoundException('Watering group not found');
    }

    if (group.user_id !== userId) {
      throw new NotFoundException('Watering group not found');
    }

    const existingSchedules = await this.wateringRepository.findAllSchedulesByGroup(groupId);
    if (existingSchedules.length > 0) {
      throw new ConflictException('This watering group already has a schedule. Only one schedule per group is allowed');
    }

    const schedule = {
      wateringGroupId: groupId,
      name: dto.name,
      days: dto.days,
      startTime: dto.startTime,
      endTime: dto.endTime
    } as WateringSchedule;

    return this.wateringRepository.createWateringSchedule(schedule);
  }
}
