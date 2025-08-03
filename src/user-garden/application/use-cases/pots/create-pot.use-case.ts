import { Injectable, Inject, ConflictException, BadRequestException } from '@nestjs/common';
import { IPotsRepository } from '../../../domain/interfaces/pots-repository.interface';
import { CreatePotDto } from '../../dtos/pots/create-pot.dto';
import { PotEntity } from '../../../domain/entities/pot.entity';
import { DuplicatePotNameError, InvalidPotStateError } from '../../../domain/errors/pot.errors';

@Injectable()
export class CreatePotUseCase {
  constructor(
    @Inject('IPotsRepository')
    private readonly potsRepository: IPotsRepository
  ) {}

  async execute(userId: string, createPotDto: CreatePotDto): Promise<{ id: string }> {
    if (!userId?.trim()) {
      throw new BadRequestException('User ID is required');
    }

    const existingPot = await this.potsRepository.findByName(userId, createPotDto.name);
    if (existingPot) {
      throw new ConflictException(`Pot with name ${createPotDto.name} already exists`);
    }

    try {
      const pot = PotEntity.create({
        user_id: userId,
        name: createPotDto.name,
        description: createPotDto.description,
        image_url: createPotDto.image_url || undefined,
        area_id: createPotDto.area_id,
        plant_id: createPotDto.plant_id,
        floor: createPotDto.floor || 1
      });

      const potId = await this.potsRepository.create({
        user_id: pot.user_id,
        name: pot.name,
        description: pot.description,
        image_url: pot.image_url,
        area_id: pot.area_id,
        plant_id: pot.plant_id,
        floor: pot.floor
      });

      if (!potId) {
        throw new BadRequestException('Failed to create pot');
      }

      return { id: potId };
    } catch (error) {
      if (error instanceof DuplicatePotNameError) {
        throw new ConflictException(error.message);
      }

      if (error instanceof InvalidPotStateError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2002') {
        throw new ConflictException('Pot with this name already exists');
      }

      if (error.code === 'P2025') {
        throw new BadRequestException('Plant or area not found');
      }

      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid plant or area reference');
      }

      throw new BadRequestException('Failed to create pot');
    }
  }
}