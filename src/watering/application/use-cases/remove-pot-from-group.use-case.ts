import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';

@Injectable()
export class RemovePotFromGroupUseCase {
  constructor(
    @Inject('IWateringRepository')
    private readonly wateringRepository: IWateringRepository
  ) {}

  async execute(userId: string, groupId: string, potId: string): Promise<void> {
    const group = await this.wateringRepository.findWateringGroupById(groupId);
    if (!group) {
      throw new NotFoundException('Watering group not found');
    }

    if (group.user_id !== userId) {
      throw new NotFoundException('Watering group not found');
    }
    const isInGroup = await this.wateringRepository.checkPotInGroup(groupId, potId);
    if (!isInGroup) {
      throw new ConflictException(`Pot with id ${potId} is not in this watering group`);
    }
    await this.wateringRepository.removePotFromGroup(groupId, potId);
  }
}
