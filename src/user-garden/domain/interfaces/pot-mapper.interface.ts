import { PotEntity } from '../entities/pot.entity';

export interface IPotMapper {
  toDomain(raw: any): PotEntity;
  toPersistence(domain: Partial<PotEntity>): any;
}