import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private Prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generate password hash using argon 2
    const hash = await argon.hash(dto.password);

    try {
      // save new user in db
      const user = await this.Prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      //return saved user

      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
        throw error;
      }
    }
  }

  async signin(dto: AuthDto) {
    //find user
    const user = await this.Prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    } else {
      const hash = user.hash;
      const valid = await argon.verify(hash, dto.password);

      if (!valid) {
        throw new ForbiddenException('Credentials incorrect');
      } else {
        delete user.hash;
        return user;
      }
    }
    //compare password
    //return user

    return { msg: 'I am signed in' };
  }
}
