import { UserDocument } from './../users/schema/user.schema';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser, Serialization } from '../common/decorators';
import { LoginDto, RegistrationDto, UserLoginDto } from './dto';

@Serialization(UserLoginDto)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registrationDto: RegistrationDto) {
    return this.authService.register(registrationDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refreshToken(@CurrentUser() user: UserDocument) {
    return this.authService.refreshToken(user.id);
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // @Post('logout')
  // logout() {
  //   return this.authService.logout();
  // }
}
