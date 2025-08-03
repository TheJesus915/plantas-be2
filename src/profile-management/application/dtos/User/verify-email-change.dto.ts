import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailChangeDto {
  @IsNotEmpty({ message: 'The email address is required' })
  @IsEmail({}, { message: 'It must be a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'The verification token is required.' })
  @IsString({ message: 'The token must be a text' })
  token: string;
}