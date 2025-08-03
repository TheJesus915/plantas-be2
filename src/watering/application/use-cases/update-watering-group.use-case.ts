import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';
import { UpdateWateringGroupDto } from '../dtos/update-watering-group.dto';
import { WateringGroup } from '../../domain/entities/watering-group.entity';

@Injectable()
export class UpdateWateringGroupUseCase {
  constructor(
    @Inject('IWateringRepository')
    private readonly wateringRepository: IWateringRepository
  ) {}

  async execute(userId: string, groupId: string, dto: UpdateWateringGroupDto): Promise<string> {
    const group = await this.wateringRepository.findWateringGroupById(groupId);
    if (!group) {
      throw new NotFoundException('Watering group not found');
    }

    if (group.user_id !== userId) {
      throw new NotFoundException('Watering group not found');
    }

    if (dto.name && dto.name !== group.name) {
      const existingGroup = await this.wateringRepository.checkExistingGroupByName(userId, dto.name);
      if (existingGroup) {
        throw new ConflictException(`A watering group with name "${dto.name}" already exists for this user`);
      }
    }

    const updatedGroup: Partial<WateringGroup> = {};

    if (dto.name) updatedGroup.name = dto.name;
    if (dto.description !== undefined) updatedGroup.description = dto.description;

    return this.wateringRepository.updateWateringGroup(groupId, updatedGroup);
  }
}
