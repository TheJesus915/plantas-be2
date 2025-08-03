import { Injectable, Inject, BadRequestException, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { IAreasRepository } from '../../../domain/interfaces/areas-repository.interface';
import { UpdateAreaDto } from '../../dtos/areas/update-area.dto';

@Injectable()
export class UpdateAreaUseCase {
  constructor(
    @Inject('IAreasRepository')
    private readonly areasRepository: IAreasRepository
  ) {}

  async execute(userId: string, id: string, updateAreaDto: UpdateAreaDto): Promise<{ id: string }> {
    if (!userId?.trim()) {
      throw new BadRequestException('User ID is required');
    }

    if (!id?.trim()) {
      throw new BadRequestException('Area ID is required');
    }

    try {
      const area = await this.areasRepository.findById(id);

      if (!area) {
        throw new NotFoundException(`Area with ID ${id} not found`);
      }

      if (!area.isOwnedBy(userId)) {
        throw new ForbiddenException('You do not have permission to update this area');
      }

      if (!area.canBeUpdated()) {
        throw new BadRequestException('Area cannot be updated in its current state');
      }

      if (updateAreaDto.name) {
        const existingArea = await this.areasRepository.findByName(userId, updateAreaDto.name);
        if (existingArea && existingArea.id !== id) {
          throw new ConflictException(`Area with name ${updateAreaDto.name} already exists`);
        }
      }

      const areaId = await this.areasRepository.update(id, {
        ...updateAreaDto,
        image_url: updateAreaDto.image_url === '' ? null : updateAreaDto.image_url
      });

      if (!areaId) {
        throw new BadRequestException('Failed to update area');
      }

      return { id: areaId };
    } catch (error) {
      if (error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2025') {
        throw new NotFoundException(`Area with ID ${id} not found`);
      }

      if (error.code === 'P2002') {
        throw new ConflictException(`Area with name ${updateAreaDto.name || ''} already exists`);
      }

      throw new BadRequestException('Failed to update area');
    }
  }
}