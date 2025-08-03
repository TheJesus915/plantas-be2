import { Injectable } from '@nestjs/common';
import { Device } from '@prisma/client';
import { DeviceEntity } from '../../domain/entities/device.entity';

@Injectable()
export class DeviceMapper {
  toDomain(prismaDevice: Device): DeviceEntity {
    return {
      id: prismaDevice.id,
      status: prismaDevice.status,
      identifier: prismaDevice.identifier,
      linking_key: prismaDevice.linking_key,
      registered_at: prismaDevice.registered_at,
      linked_at: prismaDevice.linked_at,
      light_on: prismaDevice.light_on,
      watering_on: prismaDevice.watering_on
    };
  }
}