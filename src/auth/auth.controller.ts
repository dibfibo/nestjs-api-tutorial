import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private Auth: AuthService) {}

  @Post('signup')
  signup() {
    return this.Auth.signup()
  }

  @Post('signin')
  signin() {
    return this.Auth.signin()
  }
}
