import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser$ } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { firstValueFrom, Observable } from 'rxjs';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private User: UserService) {}

  @Get('me')
  me(@GetUser$() user: Observable<User>) {
    return this.User.me(user);
  }

  @Patch()
  editUser(@GetUser$('id') user: Observable<User>, @Body() dto: EditUserDto) {
    return this.User.editUser(user, dto);
  }
}
