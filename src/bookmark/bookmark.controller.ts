import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private Bookmark: BookmarkService) {}

  @Get()
  findUserBookmark(@GetUser() user: User){
    return this.Bookmark.findUserBookmark(user);
  }

  @Get(':id')
  findUserBookmarkById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.Bookmark.findUserBookmarkById(user, id);
  }

  @Post()
  UserBookmark(
    @GetUser() user: User,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.Bookmark.createUserBookmark(user, dto);
  }

  @Patch(':id')
  editUserBookmark(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.Bookmark.editUserBookmark(user, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteUserBookmark(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.Bookmark.deleteUserBookmark(user, id);
  }
}
