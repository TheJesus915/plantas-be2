import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateStatusAccountDto {
  @IsString({ message: 'status_account must be a string' })
  @IsNotEmpty({ message: 'status_account is required' })
  @IsIn(['Active', 'Inactive', 'Pending'], { message: 'status_account must be one of: Active, Inactive, Pending' })
  status_account: string;
}

