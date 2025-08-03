import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';
import { AddPotsToGroupDto } from '../dtos/add-pots-to-group.dto';

@Injectable()
export class AddPotsToGroupUseCase {
  constructor(
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository
  ) {}

  async execute(userId: string, groupId: string, dto: AddPotsToGroupDto): Promise<void> {
    const group = await this.lightingRepository.findLightingGroupById(groupId);
    if (!group) {
      throw new NotFoundException('Lighting group not found');
    }

    if (group.user_id !== userId) {
      throw new NotFoundException('Lighting group not found');
    }

    for (const potId of dto.potIds) {
      const belongs = await this.lightingRepository.checkPotBelongsToUser(potId, userId);
      if (!belongs) {
        throw new ConflictException(`Pot with id ${potId} not found or doesn't belong to the user`);
      }

      const { hasDevice } = await this.lightingRepository.checkPotHasDevice(potId);
      if (!hasDevice) {
        throw new ConflictException(`Pot with id ${potId} doesn't have an associated device`);
      }

      const isInGroup = await this.lightingRepository.checkPotInGroup(groupId, potId);
      if (isInGroup) {
        throw new ConflictException(`Pot with id ${potId} is already in this lighting group`);
      }
      const { inGroup, groupName } = await this.lightingRepository.checkPotInAnotherGroup(potId, groupId);
      if (inGroup) {
        throw new ConflictException(
          `Pot with id ${potId} already belongs to another lighting group (${groupName}). A pot can only be in one lighting group at a time.`
        );
      }

      await this.lightingRepository.addPotToGroup(groupId, potId);
    }
  }
}
