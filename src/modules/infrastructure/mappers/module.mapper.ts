import { Module } from '@prisma/client';
import { ModuleEntity } from '../../domain/entities/module.entity';
import { ModuleResponseDto, ModuleDetailResponseDto } from '../../application/dtos/module-response.dto';

export class ModuleMapper {
  static toDomain(prismaModule: Module): ModuleEntity {
    return ModuleEntity.fromPersistence({
      id: prismaModule.id,
      name: prismaModule.name,
      description: prismaModule.description,
      isActive: prismaModule.is_active,
      createdDate: prismaModule.created_date,
    });
  }

  static toResponseWithoutDate(entity: ModuleEntity): ModuleResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? undefined,
      is_active: entity.isActive
    };
  }

  static toResponse(entity: ModuleEntity): ModuleDetailResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? undefined,
      is_active: entity.isActive,
      created_date: entity.createdDate
    };
  }
}