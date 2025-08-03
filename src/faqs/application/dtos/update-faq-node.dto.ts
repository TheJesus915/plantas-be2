import { IsObject, IsOptional } from 'class-validator';

export class UpdateFaqNodeDto {
  @IsOptional()
  @IsObject({ message: 'Content must be a valid object' })
  content?: Record<string, any>;
}