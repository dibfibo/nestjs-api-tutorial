import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private Bookmark: BookmarkService) {}

  @Get()
  findAll() {
    return this.Bookmark.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.Bookmark.findById(id);
  }

  @Post()
  create(@Body() dto: any) {
    return this.Bookmark.create(dto);
  }

  @Patch(':id')
  edit(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.Bookmark.edit(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.Bookmark.delete(id);
  }
}
