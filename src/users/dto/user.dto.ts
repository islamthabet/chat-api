import { Room } from 'src/rooms/schema/room.schema';
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
  country: any;

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
  @Transform((params) => {
    return params.obj.askToJoinRoom;
  })
  askToJoinRoom: [Room];

  @Expose()
  @Transform((params) => {
    return params.obj.rooms;
  })
  rooms: [Room];

  @Expose()
  lastSeen: string | boolean | Date;
}
