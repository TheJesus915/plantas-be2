import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';

@Injectable()
export class RemovePotFromGroupUseCase {
  constructor(
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository
  ) {}

  async execute(userId: string, groupId: string, potId: string): Promise<void> {
    const group = await this.lightingRepository.findLightingGroupById(groupId);
    if (!group) {
      throw new NotFoundException('Lighting group not found');
    }

    if (group.user_id !== userId) {
      throw new NotFoundException('Lighting group not found');
    }

    const isInGroup = await this.lightingRepository.checkPotInGroup(groupId, potId);
    if (!isInGroup) {
      throw new ConflictException(`Pot with id ${potId} is not in this lighting group`);
    }

    await this.lightingRepository.removePotFromGroup(groupId, potId);
  }
}
