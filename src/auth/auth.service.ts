import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  catchError,
  forkJoin,
  from,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { User } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(
    private Prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
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
      switchMap((hash) =>
        from(
          this.Prisma.user.create({
            data: {
              email: dto.email,
              hash,
            },
          }),
        ),
      ),
    );
  }

  signin(dto: AuthDto) {
    return this.validFoundUser$(dto).pipe(
      switchMap((user) => this.accessToken$(user)),
      catchError(() =>
        throwError(() => new ForbiddenException('Credentials incorrect')),
      ),
    );
  }

  private validFoundUser$ (dto: AuthDto) {
    return this.foundUser$(dto).pipe(
      switchMap((user) =>
        forkJoin({
          user: of(user),
          valid: this.validPassword$(user, dto),
        }),
      ),
      map(({ user }) => user),
    );
  }

  private foundUser$(dto: AuthDto) {
    return from(
      this.Prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      }),
    )
  }

  private validPassword$(user: User, dto: AuthDto) {
    return from(argon.verify(user.hash, dto.password)).pipe(
      switchMap((valid) => (valid ? of(valid) : throwError(() => {}))),
    );
  }

  private accessToken$(user: User) {
    return from(
      this.jwt.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          expiresIn: '15m',
          secret: this.config.get('JWT_SECRET'),
        },
      ),
    ).pipe(switchMap((access_token) => of({ access_token })));
  }
}
