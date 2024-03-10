import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private Prisma: PrismaService) {}

  signup(dto: AuthDto) {
    return { msg: 'I am signed up' };
  }

  signin() {
    return { msg: 'I am signed in' };
  }
}
