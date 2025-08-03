import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';
import { WateringGroupMapper } from '../../infrastructure/mappers/watering-group.mapper';

@Injectable()
export class GetWateringGroupByIdUseCase {
  constructor(
    @Inject('IWateringRepository')
    private readonly wateringRepository: IWateringRepository,
    private readonly wateringGroupMapper: WateringGroupMapper
  ) {}

  async execute(userId: string, groupId: string): Promise<any> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!groupId) {
      throw new BadRequestException('Group ID is required');
    }

    const group = await this.wateringRepository.findWateringGroupById(groupId);

    if (!group) {
      throw new NotFoundException('Watering group not found');
    }

    if (group.user_id !== userId) {
      throw new NotFoundException('Watering group not found');
    }

    return this.wateringGroupMapper.toDetailedDto(group);
  }
}