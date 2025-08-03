import { IsUUID, IsNotEmpty } from 'class-validator';

export class UnlinkDeviceDto {
  @IsUUID('4', { message: 'Device ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Device ID is required' })
  device_id: string;
}