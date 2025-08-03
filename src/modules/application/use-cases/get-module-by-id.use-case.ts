import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IModuleRepository } from '../../domain/interfaces/module.repository.interface';
import { ModuleDetailResponseDto } from '../dtos/module-response.dto';
import { ModuleMapper } from '../../infrastructure/mappers/module.mapper';

@Injectable()
export class GetModuleByIdUseCase {
  constructor(
    @Inject('IModuleRepository')
    private readonly moduleRepository: IModuleRepository,
  ) {}

  async execute(id: string): Promise<ModuleDetailResponseDto> {
    try {
      const module = await this.moduleRepository.findById(id);

      if (!module) {
        throw new NotFoundException(`Module with ID ${id} not found`);
      }

      return ModuleMapper.toResponse(module);
    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to retrieve module: ${error.message || 'Unknown error'}`,
      );
    }
  }
}