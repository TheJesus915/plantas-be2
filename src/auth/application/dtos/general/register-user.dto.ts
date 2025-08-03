import { IsString, IsEmail, MinLength, IsDate, Matches, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterUserDto {

    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @MinLength(2)
    lastname: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'The password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
    })
    password: string;

    @IsString()
    @MinLength(8)
    confirmPassword: string;

    @Type(() => Date)
    @IsDate()
    birthdate: Date;

    @IsString()
    @Matches(/^\d{10}$/, { message: 'The phone number must have 10 digits.' })
    phone: string;

    @IsString()
    country: string;

    @IsString()
    province: string;

    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    profile_picture?: string;
}
