import { IsString, IsNotEmpty, IsArray, ArrayMinSize, IsOptional, Matches, Length, IsEnum } from 'class-validator';
import { LightType } from '../../domain/entities/lighting-schedule.entity';

export class CreateLightingScheduleDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @IsArray({ message: 'Days must be an array' })
  @ArrayMinSize(1, { message: 'At least one day must be selected' })
  @IsString({ each: true, message: 'Each day must be a string' })
  days: string[];

  @IsString({ message: 'Start time must be a string' })
  @IsNotEmpty({ message: 'Start time is required' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Start time must be in format HH:MM:SS (24h)'
  })
  startTime: string;

  @IsString({ message: 'End time must be a string' })
  @IsNotEmpty({ message: 'End time is required' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'End time must be in format HH:MM:SS (24h)'
  })
  endTime: string;

  @IsEnum(LightType, { message: 'Light type must be LOW, MEDIUM, or HIGH' })
  @IsNotEmpty({ message: 'Light type is required' })
  lightType: LightType;

  @IsString({ message: 'Light color must be a string' })
  @IsNotEmpty({ message: 'Light color is required' })
  @Length(2, 50, { message: 'Light color must be between 2 and 50 characters' })
  lightColor: string;
}
