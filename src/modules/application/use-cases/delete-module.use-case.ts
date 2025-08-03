import { Injectable, Inject, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IModuleRepository } from '../../domain/interfaces/module.repository.interface';

@Injectable()
export class DeleteModuleUseCase {
  constructor(
    @Inject('IModuleRepository')
    private readonly moduleRepository: IModuleRepository
  ) {}

async execute(id: string): Promise<void> {
    try {
      const existingModule = await this.moduleRepository.findById(id);
      if (!existingModule) {
        throw new NotFoundException(`Module with ID ${id} not found`);
      }

      await this.moduleRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to delete module: ${error.message || 'Unknown error'}`
      );
    }
  }
}