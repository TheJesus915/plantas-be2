import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IPotsRepository } from '../../../domain/interfaces/pots-repository.interface';
import { PotEntity } from '../../../domain/entities/pot.entity';
import { PotNotFoundError, PotNotOwnedError } from '../../../domain/errors/pot.errors';

@Injectable()
export class GetPotUseCase {
  constructor(
    @Inject('IPotsRepository')
    private readonly potsRepository: IPotsRepository
  ) {}

  async execute(userId: string, id: string): Promise<PotEntity> {
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

      return pot;
    } catch (error) {
      if (error instanceof PotNotFoundError ||
        error instanceof PotNotOwnedError ||
        error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2025') {
        throw new PotNotFoundError(id);
      }

      throw new BadRequestException('Failed to retrieve pot');
    }
  }
}