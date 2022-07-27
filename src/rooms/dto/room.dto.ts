import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/schema/user.schema';

export class RoomDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose()
  createdAt: string;

  @Expose()
  @Transform((prop) => prop.obj.members)
  members: Array<User>;

  @Expose()
  @Transform((prop) => prop.obj.userPendingRequests)
  userPendingRequests: Array<User>;

  @Expose()
  @Transform((prop) => prop.obj.admins)
  admins: Array<User>;

  @Expose()
  @Transform((prop) => prop.obj.createdBy)
  createdBy: User;
}
