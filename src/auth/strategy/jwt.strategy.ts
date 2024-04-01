import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { from, map, of, switchMap } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  validate(payload: { sub: number; email: string }) {
    return this.findUser$(payload.sub).pipe(
      map((user) => {
        delete user.hash;
        return user;
      }),
    );
  }

  private findUser$(id: User['id']) {
    return from(
      this.prisma.user.findUnique({
        where: {
          id: id,
        },
      }),
    ).pipe(switchMap((user) => of(user)));
  }
}
