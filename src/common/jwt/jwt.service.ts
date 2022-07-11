import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  createToken(id: string) {
    const accessToken = sign(id, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = sign(id, process.env.REFRESH_TOKEN_SECRET);
    return { accessToken, refreshToken };
  }

  validateToken(token: string, type: string) {
    try {
      const payload = verify(
        token,
        type === 'accessToken'
          ? process.env.ACCESS_TOKEN_SECRET
          : process.env.REFRESH_TOKEN_SECRET,
      );
      return payload;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
