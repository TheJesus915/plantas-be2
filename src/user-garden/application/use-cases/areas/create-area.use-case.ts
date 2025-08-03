import { Injectable, Inject, BadRequestException, ConflictException } from '@nestjs/common';
import { IAreasRepository } from '../../../domain/interfaces/areas-repository.interface';
import { CreateAreaDto } from '../../dtos/areas/create-area.dto';
import { AreaEntity } from '../../../domain/entities/area.entity';

@Injectable()
export class CreateAreaUseCase {
  constructor(
    @Inject('IAreasRepository')
    private readonly areasRepository: IAreasRepository
  ) {}

  async execute(userId: string, createAreaDto: CreateAreaDto): Promise<{ id: string }> {
    if (!userId?.trim()) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const existingArea = await this.areasRepository.findByName(userId, createAreaDto.name);
      if (existingArea) {
        throw new ConflictException(`Area with name ${createAreaDto.name} already exists`);
      }

      const area = AreaEntity.create({
        user_id: userId,
        name: createAreaDto.name,
        description: createAreaDto.description,
        image_url: createAreaDto.image_url,
        area_type: createAreaDto.area_type
      });

      const areaId = await this.areasRepository.create({
        user_id: area.user_id,
        name: area.name,
        description: area.description,
        image_url: area.image_url,
        area_type: area.area_type
      });

      if (!areaId) {
        throw new BadRequestException('Failed to create area');
      }

      return { id: areaId };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2002') {
        throw new ConflictException(`Area with name ${createAreaDto.name} already exists`);
      }

      throw new BadRequestException('Failed to create area');
    }
  }
}