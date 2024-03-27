import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private Auth: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.Auth.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    console.log({
      dto,
    });
    return this.Auth.signin(dto);
  }
}
