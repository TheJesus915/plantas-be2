import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class ManualLightingControlDto {
  @IsString({ message: 'Pot ID must be a string' })
  @IsNotEmpty({ message: 'Pot ID is required' })
  potId: string;

  @IsBoolean({ message: 'Activate must be a boolean' })
  @IsNotEmpty({ message: 'Activate is required' })
  activate: boolean;
}