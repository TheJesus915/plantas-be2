import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IPotsRepository } from '../../../domain/interfaces/pots-repository.interface';
import { PotNotFoundError, PotNotOwnedError, InvalidPotStateError } from '../../../domain/errors/pot.errors';

@Injectable()
export class DeletePotUseCase {
  constructor(
    @Inject('IPotsRepository')
    private readonly potsRepository: IPotsRepository
  ) {}

  async execute(userId: string, id: string): Promise<void> {
    if (!userId?.trim()) {
      throw new BadRequestException('User ID is required');
    }

    if (!id?.trim()) {
      throw new BadRequestException('Pot ID is required');
    }

    try {
      const pot = await this.potsRepository.findById(id);

      if (!pot) {
        throw new PotNotFoundError(id);
      }

      if (!pot.isOwnedBy(userId)) {
        throw new PotNotOwnedError(id);
      }

      if (!pot.canBeDeleted()) {
        throw new InvalidPotStateError('Cannot delete a pot that has a device linked to it');
      }

      await this.potsRepository.delete(id);
    } catch (error) {
      if (error instanceof PotNotFoundError ||
        error instanceof PotNotOwnedError ||
        error instanceof InvalidPotStateError ||
        error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2025') {
        throw new PotNotFoundError(id);
      }

      throw new BadRequestException('Failed to delete pot');
    }
  }
}