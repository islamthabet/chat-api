import { User } from './../../users/schema/user.schema';
import { Expose, Transform } from 'class-transformer';

export class NotificationDto {
  @Expose()
  id: string;

  @Expose()
  notification: string;

  @Expose()
  @Transform((prop) => prop.obj.from)
  from: User;

  @Expose()
  createdAt: string;

  @Expose()
  readied: boolean;
}
