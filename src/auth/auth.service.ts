import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private Prisma: PrismaService) {}

  signup(dto: AuthDto) {
    // generate password hash using argon 2
    // save new user in db
    //return saved user

    return { msg: 'I am signed up' };
  }

  signin() {
    return { msg: 'I am signed in' };
  }
}
