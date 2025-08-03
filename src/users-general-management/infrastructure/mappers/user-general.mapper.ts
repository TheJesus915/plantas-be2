import { UserGeneralEntity } from '../../domain/entities/user-general.entity';
import { UserGeneralListDto, UserGeneralDetailDto } from '../../application/dtos/user-general.dto';

export class UserGeneralMapper {
  static toListDto(entity: UserGeneralEntity): UserGeneralListDto {
    return {
      id: entity.id,
      name: entity.name,
      lastname: entity.lastname,
      email: entity.email,
      status_account: entity.status_account,
      created_at: entity.created_at,
    };
  }

  static toDetailDto(entity: UserGeneralEntity): UserGeneralDetailDto {
    return {
      id: entity.id,
      name: entity.name,
      lastname: entity.lastname,
      email: entity.email,
      status_account: entity.status_account,
      created_at: entity.created_at,
      pots: (entity.pots || []).map(p => ({
        id: p.id,
        name: p.name,
        created_at: p.created_at,
        catalog_plant: p.catalog_plant
          ? { id: p.catalog_plant.id, name: p.catalog_plant.name }
          : { id: '', name: '' },
        device: p.device
          ? { id: p.device.id, linked_at: p.device.linked_at }
          : undefined,
      })),
    };
  }
}
