import { User } from './../../users/schema/user.schema';
import { Expose, Transform } from 'class-transformer';
import * as moment from 'moment';

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
  createdAt: string;

  @Expose()
  status: string;

  @Expose()
  @Transform((params) => {
    return moment(params.obj.endAt).diff(params.obj.createdAt, 'minutes');
  })
  duration: string;
}
