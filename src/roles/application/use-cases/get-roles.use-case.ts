import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus
} from '@nestjs/common';
import { RoleRepositoryInterface } from '../../domain/interfaces/role.repository.interface';
import { RoleMapper } from '../../infrastructure/mappers/role.mapper';
import { PaginationFilterDto, PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';
import { RoleBasicResponseDto } from '../dtos/role-basic-response.dto';

@Injectable()
export class GetRolesUseCase {
  constructor(
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly roleMapper: RoleMapper,
    private readonly paginationService: PaginationService
  ) {}

  async execute(
    filter: PaginationFilterDto,
    includeInactive: boolean = false
  ): Promise<PaginatedResponseDto<RoleBasicResponseDto>> {
    try {
      if (filter.page && filter.page < 1) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Page number must be greater than 0',
          error: 'Bad Request'
        });
      }

      if (filter.limit && (filter.limit < 1 || filter.limit > 100)) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Limit must be between 1 and 100',
          error: 'Bad Request'
        });
      }

      const isActive = includeInactive ? undefined : true;

      const result = await this.roleRepository.findAllPaginated(filter, isActive);

      const roleResponseDtos = result.roles.map(role =>
        this.roleMapper.toBasicResponseDto(role)
      );
      return this.paginationService.paginate(
        roleResponseDtos,
        result.total,
        filter
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error retrieving roles:', error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while retrieving roles',
        error: 'Internal Server Error'
      });
    }
  }
}