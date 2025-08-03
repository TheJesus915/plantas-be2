import { Injectable, Inject, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IAreasRepository } from '../../../domain/interfaces/areas-repository.interface';
import { AreaEntity } from '../../../domain/entities/area.entity';

@Injectable()
export class GetAreaUseCase {
  constructor(
    @Inject('IAreasRepository')
    private readonly areasRepository: IAreasRepository
  ) {}

  async execute(userId: string, id: string): Promise<AreaEntity> {
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
        throw new ForbiddenException('You do not have permission to access this area');
      }

      return area;
    } catch (error) {
      if (error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2025') {
        throw new NotFoundException(`Area with ID ${id} not found`);
      }

      throw new BadRequestException('Failed to retrieve area');
    }
  }
}