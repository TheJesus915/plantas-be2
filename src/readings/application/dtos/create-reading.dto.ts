import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateReadingDto {
  @IsNumber({}, { message: 'Temperature must be a number' })
  @IsOptional()
  @Min(-100, { message: 'Temperature must be at least -100°C' })
  @Max(100, { message: 'Temperature cannot exceed 100°C' })
  temperature?: number;

  @IsNumber({}, { message: 'Humidity must be a number' })
  @IsOptional()
  @Min(0, { message: 'Humidity must be at least 0%' })
  @Max(100, { message: 'Humidity cannot exceed 100%' })
  humidity?: number;

  @IsString({ message: 'Device ID must be a string' })
  @IsNotEmpty({ message: 'Device ID is required' })
  deviceId: string;
}