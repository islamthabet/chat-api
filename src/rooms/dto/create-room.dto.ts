import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  members: Array<string>;

  @IsOptional()
  @IsArray()
  admins: Array<string>;

  @IsOptional()
  image: any;
}
