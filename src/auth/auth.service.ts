import { Password } from './../common/util/Password.class';
import { UserRepository } from './../users/user.repository';
import { JwtService } from './../common/jwt/jwt.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private userRepo: UserRepository) {}

  async register(registrationDto: RegistrationDto) {
    // create hash from the password
    const password = await Password.createHash(registrationDto.password);

    // create user in the system
    const user = await this.userRepo.create({ ...registrationDto, password });

    // create token
    const { accessToken, refreshToken } = this.jwt.createToken(user.id);

    // send the token and the user
    return {
      token: {
        accessToken,
        refreshToken,
      },
      user,
    };
  }

  async login(loginDto: LoginDto) {
    // get the user
    const user = await this.userRepo.findOne({ email: loginDto.email });

    // if the user don't excite send error
    if (!user) {
      throw new BadRequestException('invalid data');
    }

    // compare the password

    if (!(await Password.validateHash(loginDto.password, user.password))) {
      throw new BadRequestException('invalid data');
    }

    // create token
    const { accessToken, refreshToken } = this.jwt.createToken(user.id);

    // send the token and the user
    return {
      token: {
        accessToken,
        refreshToken,
      },
      user,
    };
  }

  refreshToken(id: string) {
    const { accessToken, refreshToken } = this.jwt.createToken(id);
    return {
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  forgotPassword(email: string) {
    return `This action updates a  auth`;
  }

  // logout() {
  //   return `This action removes a #auth`;
  // }
}
