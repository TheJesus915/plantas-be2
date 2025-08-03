import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class AddPotsToGroupDto {
  @IsArray({ message: 'Pot IDs must be an array' })
  @ArrayMinSize(1, { message: 'At least one pot ID must be provided' })
  @IsString({ each: true, message: 'Each pot ID must be a string' })
  @IsNotEmpty({ each: true, message: 'Pot IDs cannot be empty' })
  potIds: string[];
}
