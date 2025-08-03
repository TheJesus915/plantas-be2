import { IsString, IsNotEmpty } from 'class-validator';

export class SubscribeDeviceReadingsDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}

export class DeviceReadingsResponseDto {
  deviceId: string;
  temperature?: number;
  humidity?: number;
  light_on?: boolean;
  watering_on?: boolean;
  created_at?: Date;
}