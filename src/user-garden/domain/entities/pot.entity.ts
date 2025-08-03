export class PotEntity {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  device_id?: string | null;
  area_id: string;
  plant_id: string;
  floor: number;
  created_at: Date;
  plant_name?: string;
  area_name?: string;

  static create(data: {
    user_id: string;
    name: string;
    description?: string;
    image_url?: string;
    device_id?: string;
    area_id: string;
    plant_id: string;
    floor?: number;
  }): PotEntity {
    const pot = new PotEntity();
    pot.user_id = data.user_id;
    pot.name = data.name;
    pot.description = data.description || null;
    pot.image_url = data.image_url || null;
    pot.device_id = data.device_id || null;
    pot.area_id = data.area_id;
    pot.plant_id = data.plant_id;
    pot.floor = data.floor || 1;
    return pot;
  }

  static fromPersistence(data: any): PotEntity {
    const pot = new PotEntity();
    pot.id = data.id;
    pot.user_id = data.user_id;
    pot.name = data.name;
    pot.description = data.description;
    pot.image_url = data.image_url;
    pot.device_id = data.device_id;
    pot.area_id = data.area_id;
    pot.plant_id = data.plant_id;
    pot.floor = data.floor;
    pot.created_at = data.created_at;
    pot.plant_name = data.plant_name;
    pot.area_name = data.area_name;
    return pot;
  }

  public isOwnedBy(userId: string): boolean {
    return this.user_id === userId;
  }

  public canBeUpdated(): boolean {
    return true;
  }

  public canBeDeleted(): boolean {
    return !this.device_id;
  }
}