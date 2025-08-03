import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty({ message: 'Identifier is required' })
  @IsString({ message: 'Identifier must be a string' })
  @Length(1, 100, { message: 'Identifier must be between 1 and 100 characters' })
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'Identifier can only contain letters, numbers, hyphens and underscores',
  })
  identifier: string;
}