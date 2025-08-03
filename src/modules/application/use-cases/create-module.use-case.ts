import { Injectable, Inject, ConflictException, BadRequestException } from '@nestjs/common';
import { IModuleRepository } from '../../domain/interfaces/module.repository.interface';
import { CreateModuleDto } from '../dtos/create-module.dto';
import { ModuleEntity } from '../../domain/entities/module.entity';

interface CreateModuleResponse {
  id: string;
}

@Injectable()
export class CreateModuleUseCase {
  constructor(
    @Inject('IModuleRepository')
    private readonly moduleRepository: IModuleRepository
  ) {}

  async execute(createModuleDto: CreateModuleDto): Promise<CreateModuleResponse> {
    const existingModule = await this.moduleRepository.findByName(createModuleDto.name);
    if (existingModule) {
      throw new ConflictException('Module name is already registered in the system');
    }

    const moduleData = ModuleEntity.create({
      name: createModuleDto.name,
      description: createModuleDto.description
    });

    const createdModule = await this.moduleRepository.create(moduleData);

    if (!createdModule.id) {
      throw new BadRequestException('Failed to create module in the system');
    }

    return { id: createdModule.id };
  }
}