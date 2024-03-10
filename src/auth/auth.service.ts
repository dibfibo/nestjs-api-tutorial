import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  constructor(private Prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generate password hash using argon 2
    const hash = await argon.hash(dto.password);    
    
    // save new user in db
    const user = await this.Prisma.user.create({
        data: {
            email: dto.email,
            hash
        }
    })
    //return saved user

    return user;
  }

  signin() {
    return { msg: 'I am signed in' };
  }
}
