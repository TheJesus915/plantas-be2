import { Injectable, Inject, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IAreasRepository } from '../../../domain/interfaces/areas-repository.interface';

@Injectable()
export class DeleteAreaUseCase {
  constructor(
    @Inject('IAreasRepository')
    private readonly areasRepository: IAreasRepository
  ) {}

  async execute(userId: string, id: string): Promise<void> {
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
        throw new ForbiddenException('You do not have permission to delete this area');
      }

      if (!area.canBeDeleted()) {
        throw new BadRequestException('Area cannot be deleted in its current state');
      }

      await this.areasRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2025') {
        throw new NotFoundException(`Area with ID ${id} not found`);
      }

      throw new BadRequestException('Failed to delete area');
    }
  }
}