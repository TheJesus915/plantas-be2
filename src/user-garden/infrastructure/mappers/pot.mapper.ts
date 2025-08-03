import { Injectable } from '@nestjs/common';
import { PotEntity } from '../../domain/entities/pot.entity';
import { IPotMapper } from '../../domain/interfaces/pot-mapper.interface';

@Injectable()
export class PotMapper implements IPotMapper {
  toDomain(raw: any): PotEntity {
    return PotEntity.fromPersistence({
      id: raw.id,
      user_id: raw.user_id,
      name: raw.name,
      description: raw.description,
      image_url: raw.image_url,
      device_id: raw.device_id,
      area_id: raw.area_id,
      plant_id: raw.plant_id,
      floor: raw.floor,
      created_at: raw.created_at,
      plant_name: raw.plant_name || raw.plant?.name,
      area_name: raw.area_name || raw.area?.name
    });
  }

  toPersistence(domain: Partial<PotEntity>): any {
    return {
      id: domain.id,
      user_id: domain.user_id,
      name: domain.name,
      description: domain.description,
      image_url: domain.image_url,
      device_id: domain.device_id,
      area_id: domain.area_id,
      plant_id: domain.plant_id,
      floor: domain.floor
    };
  }
}