import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';
import { LightingGroupMapper } from '../../infrastructure/mappers/lighting-group.mapper';

@Injectable()
export class GetLightingGroupByIdUseCase {
  constructor(
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository,
    private readonly lightingGroupMapper: LightingGroupMapper
  ) {}

  async execute(userId: string, groupId: string): Promise<any> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!groupId) {
      throw new BadRequestException('Group ID is required');
    }

    const group = await this.lightingRepository.findLightingGroupById(groupId);

    if (!group) {
      throw new NotFoundException('Lighting group not found');
    }

    if (group.user_id !== userId) {
      throw new NotFoundException('Lighting group not found');
    }

    return this.lightingGroupMapper.toDetailedDto(group);
  }
}
