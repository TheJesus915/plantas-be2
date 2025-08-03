import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IPotsRepository } from '../../../domain/interfaces/pots-repository.interface';
import { UpdatePotDto } from '../../dtos/pots/update-pot.dto';
import { PotNotFoundError, PotNotOwnedError, InvalidPotStateError, DuplicatePotNameError } from '../../../domain/errors/pot.errors';

@Injectable()
export class UpdatePotUseCase {
  constructor(
    @Inject('IPotsRepository')
    private readonly potsRepository: IPotsRepository
  ) {}

  async execute(userId: string, id: string, updatePotDto: UpdatePotDto): Promise<{ id: string }> {
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

      if (!pot.canBeUpdated()) {
        throw new InvalidPotStateError('Pot cannot be updated in its current state');
      }

      if (updatePotDto.name) {
        const existingPot = await this.potsRepository.findByName(userId, updatePotDto.name);
        if (existingPot && existingPot.id !== id) {
          throw new DuplicatePotNameError(updatePotDto.name);
        }
      }

      const potId = await this.potsRepository.update(id, {
        ...updatePotDto,
        image_url: updatePotDto.image_url === '' ? null : updatePotDto.image_url
      });

      if (!potId) {
        throw new BadRequestException('Failed to update pot');
      }

      return { id: potId };
    } catch (error) {
      if (error instanceof PotNotFoundError ||
        error instanceof PotNotOwnedError ||
        error instanceof InvalidPotStateError ||
        error instanceof DuplicatePotNameError ||
        error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2025') {
        throw new PotNotFoundError(id);
      }

      if (error.code === 'P2002') {
        throw new DuplicatePotNameError(updatePotDto.name || '');
      }

      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid plant or area reference');
      }

      throw new BadRequestException('Failed to update pot');
    }
  }
}