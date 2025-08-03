import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { IWateringRepository } from '../../domain/interfaces/watering-repository.interface';
import { CreateWateringGroupDto } from '../dtos/create-watering-group.dto';
import { WateringGroup } from '../../domain/entities/watering-group.entity';

@Injectable()
export class CreateWateringGroupUseCase {
  constructor(
    @Inject('IWateringRepository')
    private readonly wateringRepository: IWateringRepository
  ) {}

  async execute(userId: string, dto: CreateWateringGroupDto): Promise<string> {
    const userExists = await this.wateringRepository.checkUserExists(userId);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const existingGroup = await this.wateringRepository.checkExistingGroupByName(userId, dto.name);
    if (existingGroup) {
      throw new ConflictException(`A watering group with name "${dto.name}" already exists for this user`);
    }

    const wateringGroup = {
      userId,
      name: dto.name,
      description: dto.description,
      imageUrl: dto.imageUrl
    } as WateringGroup;

    return this.wateringRepository.createWateringGroup(wateringGroup);
  }
}
