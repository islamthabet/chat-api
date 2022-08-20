import {
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
  IsDateString,
  IsEnum,
  IsPhoneNumber,
  IsDefined,
  ValidateNested,
  IsObject,
  IsNotEmptyObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CountryDto } from '../schema/user.schema';

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

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @IsDefined()
  @Type(() => CountryDto)
  country: CountryDto;

  @IsOptional()
  image: any;
}
