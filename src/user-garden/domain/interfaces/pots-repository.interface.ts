import { PotEntity } from '../entities/pot.entity';
import { PaginatedResponseDto, PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { PotFilterDto } from '../../application/dtos/pots/pot-filter.dto';

export interface UpdatePotDeviceData {
  device_id: string | null;
}

export interface IPotsRepository {
  create(pot: CreatePotData): Promise<string>;
  update(id: string, pot: UpdatePotData): Promise<string>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<PotEntity | null>;
  findByUser(userId: string, filter: PotFilterDto): Promise<PaginatedResponseDto<any>>;
  findByName(userId: string, name: string): Promise<PotEntity | null>;
  findByUserWithDevices(userId: string, filter: PaginationFilterDto): Promise<PaginatedResponseDto<PotEntity>>;
  updateDevice(id: string, data: UpdatePotDeviceData): Promise<void>;
  findByDeviceId(deviceId: string): Promise<PotEntity | null>;
  unlinkDevice(id: string): Promise<void>;
  getLatestReadingsForPot(potId: string): Promise<{ temperature: number; humidity: number } | null>;
  getDeviceStatusForPot(potId: string): Promise<{ light_on: boolean; watering_on: boolean } | null>;
}

export interface CreatePotData {
  user_id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  area_id: string;
  plant_id: string;
  floor?: number;
}

export interface UpdatePotData {
  name?: string;
  description?: string | null;
  image_url?: string | null;
  area_id?: string;
  plant_id?: string;
  floor?: number;
}

export interface PotListItem {
  id: string;
  name: string;
  image_url: string | null;
}