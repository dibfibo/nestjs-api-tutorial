import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { User } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(
    private Prisma: PrismaService,
    private JWT: JwtService,
    private Config: ConfigService,
  ) {}

  signup(dto: AuthDto) {
    return this.createdUser$(dto).pipe(
      switchMap((user) => this.accessToken$(user)),
      catchError((error) => {
        return throwError(() => {
          if (error instanceof PrismaClientKnownRequestError)
            throw new ForbiddenException('Credentials taken');
          throw error;
        });
      }),
    );
  }

  private createdUser$(dto: AuthDto) {
    return from(argon.hash(dto.password)).pipe(
      map((hash) => ({ email: dto.email, hash: hash })),
      switchMap((data) => this.Prisma.user.create({ data })),
    );
  }

  signin(dto: AuthDto) {
    return this.findUser$(dto).pipe(
      switchMap((user) => this.withVerifiedPassword$(user, dto)),
      switchMap((user) => this.accessToken$(user)),
      catchError(() =>
        throwError(() => new ForbiddenException('Credentials incorrect')),
      ),
    );
  }

  private findUser$(dto: AuthDto) {
    return from(
      this.Prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      }),
    );
  }

  private withVerifiedPassword$(user: User, dto: AuthDto) {
    return from(argon.verify(user.hash, dto.password)).pipe(
      switchMap((valid) => (valid ? of(user) : throwError(() => {}))),
    );
  }

  private accessToken$(user: User) {
    return from(
      this.JWT.signAsync(
        { sub: user.id, email: user.email },
        {
          expiresIn: '15m',
          secret: this.Config.get('JWT_SECRET'),
        },
      ),
    ).pipe(map((access_token) => ({ access_token })));
  }
}
