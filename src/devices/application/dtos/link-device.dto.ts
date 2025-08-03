import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class LinkDeviceDto {
  @IsString({ message: 'Linking key must be a string' })
  @IsNotEmpty({ message: 'Linking key is required' })
  linking_key: string;

  @IsUUID('4', { message: 'Pot ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Pot ID is required' })
  pot_id: string;
}