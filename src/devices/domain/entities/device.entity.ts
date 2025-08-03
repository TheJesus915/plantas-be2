import { DeviceStatus } from '@prisma/client';

export class DeviceEntity {
  id: string;
  status: DeviceStatus;
  identifier: string;
  linking_key: string;
  registered_at: Date;
  linked_at: Date | null;
  light_on: boolean;
  watering_on: boolean;
}