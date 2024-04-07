import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  catchError,
  map,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private Prisma: PrismaService) {}

  findUserBookmark(user$: Observable<User>) {
    return user$.pipe(
      switchMap((user) =>
        this.Prisma.bookmark.findMany({
          where: {
            userId: user.id,
          },
        }),
      ),
    );
  }

  findUserBookmarkById(user$: Observable<User>, id: number) {
    return user$.pipe(
      switchMap((user) =>
        this.Prisma.bookmark.findUniqueOrThrow({
          where: {
            id: id,
            userId: user.id,
          },
        }),
      ),
      catchError(() =>
        throwError(() => new ForbiddenException('Access to resources denied')),
      ),
    );
  }

  createUserBookmark(user$: Observable<User>, dto: CreateBookmarkDto) {
    return user$.pipe(
      map((user) => user.id),
      switchMap((userId) =>
        this.Prisma.bookmark.create({
          data: {
            userId,
            ...dto,
          },
        }),
      ),
    );
  }

  editUserBookmark(user$: Observable<User>, id: number, dto: EditBookmarkDto) {
    return this.findUserBookmarkId$(user$, id).pipe(
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

  deleteUserBookmark(user$: Observable<User>, id: number) {
    return this.findUserBookmarkId$(user$, id).pipe(
      switchMap((id) =>
        this.Prisma.bookmark.delete({
          where: {
            id,
          },
        }),
      ),
    );
  }

  private findUserBookmarkId$(user$: Observable<User>, id: number) {
    return this.findUserBookmarkById(user$, id).pipe(
      map((bookmark) => bookmark.id),
    );
  }
}
