import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IAreasRepository } from '../../../domain/interfaces/areas-repository.interface';

@Injectable()
export class GetAreasUseCase {
  constructor(
    @Inject('IAreasRepository')
    private readonly areasRepository: IAreasRepository
  ) {}

  async execute(userId: string, filters: any): Promise<any> {
    if (!userId?.trim()) {
      throw new BadRequestException('User ID is required');
    }

    try {
      return await this.areasRepository.findByUserId(userId, filters);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to retrieve areas');
    }
  }
}