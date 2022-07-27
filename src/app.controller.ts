import { interval, map, Observable } from 'rxjs';
import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  // @Sse('event')
  // sse(): Observable<any> {

  //   // return interval(1000).pipe(map((_, index) => `hello ${index}`));
  // }
}
