import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';
import { AddPotsToGroupDto } from '../dtos/add-pots-to-group.dto';

@Injectable()
export class AddPotsToGroupUseCase {
  constructor(
    @Inject('IWateringRepository')
    private readonly wateringRepository: IWateringRepository
  ) {}

  async execute(userId: string, groupId: string, dto: AddPotsToGroupDto): Promise<void> {
    const group = await this.wateringRepository.findWateringGroupById(groupId);
    if (!group) {
      throw new NotFoundException('Watering group not found');
    }

    if (group.user_id !== userId) {
      throw new NotFoundException('Watering group not found');
    }

    for (const potId of dto.potIds) {
      const belongs = await this.wateringRepository.checkPotBelongsToUser(potId, userId);
      if (!belongs) {
        throw new ConflictException(`Pot with id ${potId} not found or doesn't belong to the user`);
      }

      const { hasDevice } = await this.wateringRepository.checkPotHasDevice(potId);
      if (!hasDevice) {
        throw new ConflictException(`Pot with id ${potId} doesn't have an associated device`);
      }

      const isInGroup = await this.wateringRepository.checkPotInGroup(groupId, potId);
      if (isInGroup) {
        throw new ConflictException(`Pot with id ${potId} is already in this watering group`);
      }

      await this.wateringRepository.addPotToGroup(groupId, potId);
    }
  }
}
