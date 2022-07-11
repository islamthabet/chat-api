import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  DOB: string;

  @Expose()
  gender: string;

  @Expose()
  phone: string;

  @Expose()
  country: string;

  @Expose()
  image: string;

  @Expose()
  role: string;

  @Expose()
  friends: any;
}
