import { IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { DeviceStatus } from '@prisma/client';

export class UpdateDeviceDto {
  @IsOptional()
  @IsString({ message: 'Identifier must be a string' })
  @Length(1, 100, { message: 'Identifier must be between 1 and 100 characters' })
  identifier?: string;

  @IsOptional()
  @IsEnum(DeviceStatus, { message: 'Invalid device status' })
  status?: DeviceStatus;
}