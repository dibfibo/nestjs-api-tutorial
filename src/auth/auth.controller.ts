import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private Auth: AuthService) {}

  @Post('signup')
  signup(@Req() req: Request) {
    console.log(req.body);
    
    return this.Auth.signup()
  }

  @Post('signin')
  signin() {
    return this.Auth.signin()
  }
}
