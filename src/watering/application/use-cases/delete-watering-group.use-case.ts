import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';

@Injectable()
export class DeleteWateringGroupUseCase {
  constructor(
    @Inject('IWateringRepository')
    private readonly wateringRepository: IWateringRepository
  ) {}

  async execute(userId: string, groupId: string): Promise<void> {
    const group = await this.wateringRepository.findWateringGroupById(groupId);

    if (!group || group.user_id !== userId) {
      throw new NotFoundException('Watering group not found');
    }
    await this.wateringRepository.deleteWateringGroup(groupId);
  }
}
