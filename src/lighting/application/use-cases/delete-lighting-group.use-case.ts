import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';

@Injectable()
export class DeleteLightingGroupUseCase {
  constructor(
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository
  ) {}

  async execute(userId: string, groupId: string): Promise<void> {
    const group = await this.lightingRepository.findLightingGroupById(groupId);

    if (!group || group.user_id !== userId) {
      throw new NotFoundException('Lighting group not found');
    }
    await this.lightingRepository.deleteLightingGroup(groupId);
  }
}
