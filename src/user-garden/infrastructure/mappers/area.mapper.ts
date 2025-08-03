import { Injectable } from '@nestjs/common';
import { AreaEntity } from '../../domain/entities/area.entity';

@Injectable()
export class AreaMapper {
  toDomain(area: any): AreaEntity {
    return AreaEntity.fromPersistence(area);
  }

  toPersistence(area: AreaEntity): any {
    return {
      id: area.id,
      user_id: area.user_id,
      name: area.name,
      description: area.description,
      image_url: area.image_url,
      area_type: area.area_type,
      created_at: area.created_at
    };
  }
}