import { AreaEntity } from '../entities/area.entity';

export interface IAreasRepository {
  create(data: any): Promise<string>;
  findById(id: string): Promise<AreaEntity | null>;
  findByName(userId: string, name: string): Promise<AreaEntity | null>;
  findByUserId(userId: string, filters?: any): Promise<any>;
  update(id: string, data: any): Promise<string>;
  delete(id: string): Promise<void>;
  count(userId: string, filters?: any): Promise<number>;
}