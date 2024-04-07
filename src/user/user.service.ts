import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { from, map, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  me(user$: Observable<User>) {
    return user$.pipe(
      map((user) => {
        delete user.hash;
        return user;
      }),
    );
  }

  editUser(user$: Observable<User>, dto: EditUserDto) {
    return user$.pipe(
      switchMap((user) =>
        this.prisma.user.update({
          where: { id: user.id },
          data: { ...dto },
        }),
      ),
      switchMap((user) => this.me(of(user))),
    );
  }
}
