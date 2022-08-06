import { User } from './../../users/schema/user.schema';
import { Expose, Transform } from 'class-transformer';

export class CallDto {
  @Expose()
  id: string;

  @Expose()
  @Transform((params) => params.obj.from)
  from: User;

  @Expose()
  @Transform((params) => params.obj.to)
  to: User;

  @Expose()
  duration: string;
}
