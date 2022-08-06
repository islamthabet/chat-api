import { IsEnum, IsString } from 'class-validator';

export class CreateCallDto {
  @IsString()
  to: string;
  @IsEnum(['audio', 'video'])
  type: 'audio' | 'video';
}
