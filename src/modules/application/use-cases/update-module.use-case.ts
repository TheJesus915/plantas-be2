import { Injectable, Inject, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { IModuleRepository } from '../../domain/interfaces/module.repository.interface';
import { UpdateModuleDto } from '../dtos/update-module.dto';

interface UpdateModuleResponse {
  id: string;
}

@Injectable()
export class UpdateModuleUseCase {
  constructor(
    @Inject('IModuleRepository')
    private readonly moduleRepository: IModuleRepository
  ) {}

  async execute(id: string, updateModuleDto: UpdateModuleDto): Promise<UpdateModuleResponse> {
    if (!Object.keys(updateModuleDto).length) {
      throw new BadRequestException('No data provided for update');
    }

    const existingModule = await this.moduleRepository.findById(id);
    if (!existingModule) {
      throw new NotFoundException('Module not found in the system');
    }

    if (updateModuleDto.name) {
      const nameExists = await this.moduleRepository.exists(updateModuleDto.name, id);
      if (nameExists) {
        throw new ConflictException('Module name is already registered in the system');
      }
    }

    const updateData = existingModule.update(
      updateModuleDto.name,
      updateModuleDto.description,
      updateModuleDto.is_active
    );

    const updatedModule = await this.moduleRepository.update(id, updateData);

    if (!updatedModule.id) {
      throw new BadRequestException('Failed to update module in the system');
    }

    return { id: updatedModule.id };
  }
}