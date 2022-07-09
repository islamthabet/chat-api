import { JwtService } from './jwt.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
