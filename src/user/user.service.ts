import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { from, of, switchMap } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  me(user: User) {
    delete user.hash;
    return of(user);
  }

  editUser(user: User, dto: EditUserDto) {
    return from(
      this.prisma.user.update({
        where: { id: user.id },
        data: { ...dto },
      }),
    ).pipe(switchMap((user) => this.me(user)));
  }
}
