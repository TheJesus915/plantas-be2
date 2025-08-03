import { Expose } from 'class-transformer';
import { DeviceStatus } from '@prisma/client';

export class DeviceResponseDto {
  @Expose()
  id: string;

  @Expose()
  identifier: string;

  @Expose()
  status: DeviceStatus;

  @Expose()
  linking_key: string;
}

export class DeviceDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  identifier: string;

  @Expose()
  status: DeviceStatus;

  @Expose()
  linking_key: string;

  @Expose()
  registered_at: Date;

  @Expose()
  linked_at: Date | null;

  @Expose()
  light_on: boolean;

  @Expose()
  watering_on: boolean;
}