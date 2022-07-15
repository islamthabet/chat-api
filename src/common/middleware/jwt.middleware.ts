import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserRepository } from './../../users/user.repository';
import { JwtService } from './../jwt/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService, private readonly userRepo: UserRepository) {}
  async use(req: Request, res: Response, next: Function) {
    const url = req.baseUrl;
    if (
      url.includes('login') ||
      url.includes('register') ||
      url.includes('resetPassword') ||
      url.includes('images')
    ) {
      next();
      return;
    }

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const type = url.includes('refreshToken') ? 'refreshToken' : 'accessToken';
      const payload = this.jwt.validateToken(
        req.headers.authorization.split(' ')[1],
        type,
      ) as string;
      const user = await this.userRepo.findByIdWithPopulate(payload, [
        { path: 'pendingResponse', property: 'name | email | country | image | lastSeen' },
        { path: 'sendRequest', property: 'name | email | country | image | lastSeen' },
        { path: 'friends', property: 'name | email | country | image | lastSeen' },
      ]);
      if (!user) {
        throw new UnauthorizedException();
      }
      req['user'] = user;
      next();
    } else {
      throw new UnauthorizedException();
    }
  }
}
