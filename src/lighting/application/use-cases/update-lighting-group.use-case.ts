import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';
import { UpdateLightingGroupDto } from '../dtos/update-lighting-group.dto';
import { LightingGroup } from '../../domain/entities/lighting-group.entity';

@Injectable()
export class UpdateLightingGroupUseCase {
  constructor(
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository
  ) {}

  async execute(userId: string, groupId: string, dto: UpdateLightingGroupDto): Promise<string> {
    const group = await this.lightingRepository.findLightingGroupById(groupId);
    if (!group) {
      throw new NotFoundException('Lighting group not found');
    }

    if (group.user_id !== userId) {
      throw new NotFoundException('Lighting group not found');
    }

    if (dto.name && dto.name !== group.name) {
      const existingGroup = await this.lightingRepository.checkExistingGroupByName(userId, dto.name);
      if (existingGroup) {
        throw new ConflictException(`A lighting group with name "${dto.name}" already exists for this user`);
      }
    }

    const updatedGroup: Partial<LightingGroup> = {};

    if (dto.name) updatedGroup.name = dto.name;
    if (dto.description !== undefined) updatedGroup.description = dto.description;

    return this.lightingRepository.updateLightingGroup(groupId, updatedGroup);
  }
}
