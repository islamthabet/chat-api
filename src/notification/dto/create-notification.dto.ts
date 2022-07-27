import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  notification: string;

  @IsNotEmpty()
  @IsArray()
  to: Array<string>;
}
