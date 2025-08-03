import { IsString, IsNotEmpty, IsArray, ArrayMinSize, IsOptional, Matches, Length, IsEnum } from 'class-validator';
import { LightType } from '../../domain/entities/lighting-schedule.entity';

export class UpdateLightingScheduleDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name?: string;

  @IsOptional()
  @IsArray({ message: 'Days must be an array' })
  @ArrayMinSize(1, { message: 'At least one day must be selected' })
  @IsString({ each: true, message: 'Each day must be a string' })
  days?: string[];

  @IsOptional()
  @IsString({ message: 'Start time must be a string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Start time must be in format HH:MM:SS (24h)'
  })
  startTime?: string;

  @IsOptional()
  @IsString({ message: 'End time must be a string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'End time must be in format HH:MM:SS (24h)'
  })
  endTime?: string;

  @IsOptional()
  @IsEnum(LightType, { message: 'Light type must be LOW, MEDIUM, or HIGH' })
  lightType?: LightType;

  @IsOptional()
  @IsString({ message: 'Light color must be a string' })
  @Length(2, 50, { message: 'Light color must be between 2 and 50 characters' })
  lightColor?: string;
}
