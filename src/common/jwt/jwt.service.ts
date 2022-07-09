import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  createToken(id: string) {
    return sign(id, 'superSecret');
  }

  validateToken(token: string) {
    try {
      const payload = verify(token, 'superSecret');
      return payload;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
