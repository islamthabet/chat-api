import {
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
  IsDateString,
  IsEnum,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(8)
  @MaxLength(50)
  oldPassword: string;

  @IsOptional()
  @MinLength(8)
  @MaxLength(50)
  newPassword: string;

  @IsOptional()
  name: string;

  @IsOptional()
  @IsDateString()
  DOB: string;

  @IsOptional()
  @IsEnum(['male', 'female'])
  gender: string;

  @IsOptional()
  @IsPhoneNumber('EG')
  phone: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  image: any;
}
