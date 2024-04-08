import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { catchError, from, map, switchMap, throwError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private Prisma: PrismaService) {}

  findUserBookmark(user: User) {
    return from(
      this.Prisma.bookmark.findMany({
        where: {
          userId: user.id,
        },
      }),
    );
  }

  findUserBookmarkById(user: User, id: number) {
    return from(
      this.Prisma.bookmark.findUniqueOrThrow({
        where: {
          id: id,
          userId: user.id,
        },
      }),
    ).pipe(
      catchError(() =>
        throwError(() => new ForbiddenException('Access to resources denied')),
      ),
    );
  }

  createUserBookmark(user: User, dto: CreateBookmarkDto) {
    return from(
      this.Prisma.bookmark.create({
        data: {
          userId: user.id,
          ...dto,
        },
      }),
    );
  }

  editUserBookmark(user: User, id: number, dto: EditBookmarkDto) {
    return this.findUserBookmarkId$(user, id).pipe(
      switchMap((id) =>
        this.Prisma.bookmark.update({
          where: {
            id,
          },
          data: {
            ...dto,
          },
        }),
      ),
    );
  }

  deleteUserBookmark(user: User, id: number) {
    return this.findUserBookmarkId$(user, id).pipe(
      switchMap((id) =>
        this.Prisma.bookmark.delete({
          where: {
            id,
          },
        }),
      ),
    );
  }

  private findUserBookmarkId$(user: User, id: number) {
    return this.findUserBookmarkById(user, id).pipe(
      map((bookmark) => bookmark.id),
    );
  }
}
