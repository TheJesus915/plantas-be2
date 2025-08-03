import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestEmailChangeDto {
  @IsNotEmpty({ message: 'The new email is required' })
  @IsEmail({}, { message: 'It must be a valid email address.' })
  newEmail: string;

  @IsNotEmpty({ message: 'The password is required to verify your identity' })
  @IsString({ message: 'The password must be a text' })
  password: string;
}