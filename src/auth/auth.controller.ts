import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private Auth: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    console.log({dto});
    
    return this.Auth.signup()
  }

  @Post('signin')
  signin() {
    return this.Auth.signin()
  }
}
