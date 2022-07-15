import { Expose, Transform } from 'class-transformer';
import { User } from '../schema/user.schema';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  age: string;

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
  @Transform((params) => {
    return params.obj.sendRequest;
  })
  sendRequest: [User];

  @Expose()
  @Transform((params) => {
    return params.obj.pendingResponse;
  })
  pendingResponse: [User];

  @Expose()
  @Transform((params) => {
    return params.obj.friends;
  })
  friends: [User];

  @Expose()
  lastSeen: string | boolean | Date;
}
