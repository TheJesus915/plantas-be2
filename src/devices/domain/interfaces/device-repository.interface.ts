import { DeviceEntity } from '../entities/device.entity';
import { PaginationFilterDto, PaginatedResponseDto } from '../../../shared/application/dtos/pagination.dto';

export interface CreateDeviceData {
  identifier: string;
  status: DeviceEntity['status'];
  linked_at: DeviceEntity['linked_at'];
}

export interface IDeviceRepository {
  create(data: CreateDeviceData): Promise<DeviceEntity>;
  update(id: string, data: Partial<DeviceEntity>): Promise<DeviceEntity>;
  regenerateLinkingKey(id: string): Promise<DeviceEntity>;
  findById(id: string): Promise<DeviceEntity | null>;
  findByIds(ids: string[]): Promise<DeviceEntity[]>;
  findByIdentifier(identifier: string): Promise<DeviceEntity | null>;
  findByLinkingKey(linking_key: string): Promise<DeviceEntity | null>;
  findAll(filter: PaginationFilterDto): Promise<PaginatedResponseDto<DeviceEntity>>;
  getLatestReadingsForDevice(deviceId: string): Promise<{
    temperature: number; humidity: number; created_at: Date } | null>;
  isUserDevice(deviceId: string, userId: string): Promise<boolean>;
}