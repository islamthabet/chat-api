import { User } from './../../users/schema/user.schema';
import { Expose, Transform } from 'class-transformer';
export class MessageDto {
  @Expose()
  id: string;

  @Expose()
  @Transform((prop) => prop.obj.from)
  from: User;

  @Expose()
  @Transform((prop) => prop.obj.to)
  to: User;

  @Expose()
  message: string;

  @Expose()
  createdAt: Date;
}
