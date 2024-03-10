import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private Auth: AuthService) {}

  @Post('signup')
  signup(
    @Body('email') email: AuthDto['email'],
    @Body('password', ParseIntPipe) password: AuthDto['password'],
  ) {
    console.log({
      email,
      password,
    });

    return this.Auth.signup();
  }

  @Post('signin')
  signin() {
    return this.Auth.signin();
  }
}
