import { Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsPhoneNumber,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CountryDto } from 'src/users/schema/user.schema';

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

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @IsDefined()
  @Type(() => CountryDto)
  country: CountryDto;
}
