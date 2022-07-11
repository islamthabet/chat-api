import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class RegistrationDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(50)
    password: string;
  
    @IsNotEmpty()
    name: string;
  
    @IsNotEmpty()
    @IsDateString()
    DOB: string;
  
    @IsNotEmpty()
    @IsEnum(['male', 'female'])
    gender: string;
  
    @IsNotEmpty()
    @IsPhoneNumber('EG')
    phone: string;
  
    @IsNotEmpty()
    @IsString()
    country: string;
}