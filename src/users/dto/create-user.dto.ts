import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
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
  @IsEnum(['admin', 'user'])
  role: string;

  @IsNotEmpty()
  @IsPhoneNumber('EG')
  phone: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsOptional()
  image: any;

  // @IsNotEmpty()
  // @IsString()
  // city: string;
}
