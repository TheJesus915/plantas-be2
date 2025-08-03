import { IsString, IsOptional, IsArray, Length, Matches, ArrayUnique, MaxLength, ValidateIf } from 'class-validator';

export class UpdateWateringScheduleDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters long' })
  name?: string;

  @IsOptional()
  @IsArray({ message: 'Days must be an array of strings' })
  @ArrayUnique({ message: 'Days must be unique' })
  @IsString({ each: true, message: 'Each day must be a string' })
  days?: string[];

  @IsOptional()
  @IsString({ message: 'Start time must be a string' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM:SS format'
  })
  startTime?: string;

  @IsOptional()
  @IsString({ message: 'End time must be a string' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'End time must be in HH:MM:SS format'
  })
  @ValidateIf((o) => !!o.startTime || !!o.endTime)
  endTime?: string;
}
