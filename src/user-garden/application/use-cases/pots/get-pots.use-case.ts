import { Injectable, Inject } from '@nestjs/common';
import { IPotsRepository } from '../../../domain/interfaces/pots-repository.interface';
import { PaginatedResponseDto } from '../../../../shared/application/dtos/pagination.dto';
import { PotFilterDto } from '../../dtos/pots/pot-filter.dto';

@Injectable()
export class GetPotsUseCase {
  constructor(
    @Inject('IPotsRepository')
    private readonly potsRepository: IPotsRepository
  ) {}

  async execute(userId: string, filter: PotFilterDto): Promise<PaginatedResponseDto<any>> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!filter) {
      filter = new PotFilterDto();
    }

    return this.potsRepository.findByUser(userId, filter);
  }
}