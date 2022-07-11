import { UserDto } from './../../users/dto/user.dto';
import { Expose, Type } from 'class-transformer';

export class UserLoginDto {
  @Expose()
  token: {
    accessToken: string;
    refreshToken: string;
  };

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
