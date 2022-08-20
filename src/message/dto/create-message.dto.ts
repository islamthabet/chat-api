import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  toUser: string;

  @IsOptional()
  @IsString()
  toRoom: string;

  file: any;
}
