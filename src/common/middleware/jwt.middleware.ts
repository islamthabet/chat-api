import { UserRepository } from './../../users/user.repository';
import { JwtService } from './../jwt/jwt.service';

import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService, private userRepo: UserRepository) {}
  async use(req: Request, res: Response, next: Function) {
    const url = req.baseUrl;
    if (url.includes('login') || url.includes('register')) {
      next();
      return;
    }

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const payload = this.jwt.validateToken(req.headers.authorization.split(' ')[1]) as string;
      console.log({ payload });
      const user = await this.userRepo.findById(payload);
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
