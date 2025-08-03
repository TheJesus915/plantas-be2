import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{6}$/, { message: 'Code must be exactly 6 digits' })
    code: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one lowercase letter, one uppercase letter and one number'
    })
    newPassword: string;
}