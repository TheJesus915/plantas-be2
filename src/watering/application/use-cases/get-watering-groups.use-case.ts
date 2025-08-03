import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';
import { PaginationFilterDto, PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';

@Injectable()
export class GetWateringGroupsUseCase {
  constructor(
    @Inject('IWateringRepository')
    private readonly wateringRepository: IWateringRepository,
    private readonly paginationService: PaginationService
  ) {}

  async execute(userId: string, filter: PaginationFilterDto): Promise<PaginatedResponseDto<any>> {
    try {
      const { data, totalItems } = await this.wateringRepository.findAllWateringGroupsPaginated(userId, filter);

      const mappedGroups = data.map(group => ({
        id: group.id,
        name: group.name,
        imageUrl: group.image_url || null
      }));

      return this.paginationService.paginate(mappedGroups, totalItems, filter);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve watering groups');
    }
  }
}