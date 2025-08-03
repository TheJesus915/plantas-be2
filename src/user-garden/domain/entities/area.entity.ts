import { AreaType } from '@prisma/client';

export class AreaEntity {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  area_type: AreaType;
  created_at: Date;

  static create(data: {
    user_id: string;
    name: string;
    description?: string;
    image_url?: string;
    area_type?: AreaType;
  }): AreaEntity {
    const area = new AreaEntity();
    area.user_id = data.user_id;
    area.name = data.name;
    area.description = data.description || null;
    area.image_url = data.image_url || null;
    area.area_type = data.area_type || AreaType.INTERIOR;
    return area;
  }

  static fromPersistence(data: any): AreaEntity {
    const area = new AreaEntity();
    area.id = data.id;
    area.user_id = data.user_id;
    area.name = data.name;
    area.description = data.description;
    area.image_url = data.image_url;
    area.area_type = data.area_type;
    area.created_at = data.created_at;
    return area;
  }

  isOwnedBy(userId: string): boolean {
    return this.user_id === userId;
  }

  canBeDeleted(): boolean {
    return true;
  }

  canBeUpdated(): boolean {
    return true;
  }
}