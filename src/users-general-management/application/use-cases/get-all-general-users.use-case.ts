import { Inject, Injectable } from '@nestjs/common';
import { IUserGeneralRepository } from '../../domain/interfaces/user-general-repository.interface';
import { UserGeneralMapper } from '../../infrastructure/mappers/user-general.mapper';
import { UserGeneralListDto } from '../dtos/user-general.dto';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';
import { PaginationFilterDto, PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';

@Injectable()
export class GetAllGeneralUsersUseCase {
  constructor(
    @Inject('IUserGeneralRepository')
    private readonly userGeneralRepository: IUserGeneralRepository,
    private readonly paginationService: PaginationService
  ) {}

  async execute(filter: PaginationFilterDto): Promise<PaginatedResponseDto<UserGeneralListDto>> {
    const paginated = await this.userGeneralRepository.findAllGeneralUsers(filter);
    return this.paginationService.paginate(
      paginated.data.map(UserGeneralMapper.toListDto),
      paginated.meta.totalItems,
      filter
    );
  }
}
