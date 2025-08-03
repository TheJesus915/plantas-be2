import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'The current password is required' })
  @IsString({ message: 'The current password must be text' })
  currentPassword: string;

  @IsNotEmpty({ message: 'The new password is required' })
  @IsString({ message: 'The new password must be a text' })
  @MinLength(8, { message: 'The password must have at least 8 characters.' })
  @MaxLength(50, { message: 'The password cannot have more than 50 characters.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must include at least one uppercase letter, one lowercase letter, and one number or special character.',
  })
  newPassword: string;
}