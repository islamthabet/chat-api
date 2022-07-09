import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const Serialization = (dto: unknown) => {
  return UseInterceptors(new SerializationInterceptor(dto));
};

@Injectable()
export class SerializationInterceptor implements NestInterceptor {
  constructor(private dto: unknown) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(data, this.dto);
      }),
    );
  }
}
