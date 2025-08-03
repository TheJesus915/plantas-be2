import { IsString, IsNotEmpty } from 'class-validator';

export class SubscribePotReadingsDto {
  @IsString()
  @IsNotEmpty()
  potId: string;
}

export class PotReadingsResponseDto {
  potId: string;
  temperature?: number;
  humidity?: number;
  light_on?: boolean;
  watering_on?: boolean;
}
