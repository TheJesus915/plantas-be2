import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';
import { PaginationFilterDto, PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';

@Injectable()
export class GetLightingGroupsUseCase {
  constructor(
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository,
    private readonly paginationService: PaginationService
  ) {}

  async execute(userId: string, filter: PaginationFilterDto): Promise<PaginatedResponseDto<any>> {
    try {
      const { data, totalItems } = await this.lightingRepository.findAllLightingGroupsPaginated(userId, filter);

      const mappedGroups = data.map(group => ({
        id: group.id,
        name: group.name,
        imageUrl: group.image_url || null
      }));

      return this.paginationService.paginate(mappedGroups, totalItems, filter);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve lighting groups');
    }
  }
}
