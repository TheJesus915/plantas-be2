import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { ILightingRepository } from '../../domain/interfaces/lighting-repository.interface';
import { CreateLightingGroupDto } from '../dtos/create-lighting-group.dto';
import { LightingGroup } from '../../domain/entities/lighting-group.entity';

@Injectable()
export class CreateLightingGroupUseCase {
  constructor(
    @Inject('ILightingRepository')
    private readonly lightingRepository: ILightingRepository
  ) {}

  async execute(userId: string, dto: CreateLightingGroupDto): Promise<string> {
    const userExists = await this.lightingRepository.checkUserExists(userId);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const existingGroup = await this.lightingRepository.checkExistingGroupByName(userId, dto.name);
    if (existingGroup) {
      throw new ConflictException(`A lighting group with name "${dto.name}" already exists for this user`);
    }

    const lightingGroup = {
      userId,
      name: dto.name,
      description: dto.description,
      imageUrl: dto.imageUrl
    } as LightingGroup;

    return this.lightingRepository.createLightingGroup(lightingGroup);
  }
}
