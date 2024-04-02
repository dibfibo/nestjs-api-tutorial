import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private Prisma: PrismaService) {}

  findAll() {
    return from(this.Prisma.bookmark.findMany());
  }

  findById(id: number) {
    return from(
      this.Prisma.bookmark.findUnique({
        where: {
          id,
        },
      }),
    );
  }

  create(dto: any) {
    return from(
      this.Prisma.bookmark.create({
        data: { ...dto },
      }),
    );
  }

  edit(id: number, dto: any) {
    return from(
      this.Prisma.bookmark.update({
        where: {
          id,
        },
        data: {
          ...dto,
        },
      }),
    );
  }

  delete(id: number) {
    return from(
      this.Prisma.bookmark.delete({
        where: {
          id,
        },
      }),
    );
  }
}
