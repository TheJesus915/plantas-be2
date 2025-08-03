import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IModuleRepository } from '../../domain/interfaces/module.repository.interface';
import { ModuleResponseDto } from '../dtos/module-response.dto';
import { ModuleMapper } from '../../infrastructure/mappers/module.mapper';
import { PaginationFilterDto, PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';
import { PaginationService } from '../../../shared/infrastructure/services/pagination.service';

@Injectable()
export class GetAllModulesUseCase {
  constructor(
    @Inject('IModuleRepository')
    private readonly moduleRepository: IModuleRepository,
    private readonly paginationService: PaginationService
  ) {}

 async execute(
    filter: PaginationFilterDto,
    includeInactive: boolean = false
  ): Promise<PaginatedResponseDto<ModuleResponseDto>> {
    try {
      const { data, totalItems } = await this.moduleRepository.findAllPaginated(
        filter,
        includeInactive
      );

      const moduleDtos = data.map(module => ModuleMapper.toResponseWithoutDate(module));

      return this.paginationService.paginate(moduleDtos, totalItems, filter);
    } catch (error) {
      console.error('Error retrieving modules:', error);
      throw new InternalServerErrorException(
        'An error occurred while retrieving the modules'
      );
    }
  }
  async findAll(includeInactive: boolean = false): Promise<ModuleResponseDto[]> {
    try {
      const modules = await this.moduleRepository.findAll(includeInactive);
      return modules.map(module => ModuleMapper.toResponse(module));
    } catch (error) {
      console.error('Error retrieving all modules:', error);
      throw new InternalServerErrorException(
        'An error occurred while retrieving all modules'
      );
    }
  }

}