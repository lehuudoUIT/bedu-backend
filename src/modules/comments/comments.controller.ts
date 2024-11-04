import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.create(createCommentDto);
  }

  @Get('parent/:id')
  async getCommentsByParentId(
    @Param('id') id: number,
    @Query('lessonId') lessonId: number,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return await this.commentsService.getCommentsByParentId({
      lessonId,
      parentCommentId: id,
      limit,
      offset,
    });
  }

  @Delete(':commentId/:lessonId')
  async findOne(
    @Param('commentId') commentId: number,
    @Param('lessonId') lessonId: number,
  ) {
    return await this.commentsService.deleteComments({ commentId, lessonId });
  }
}
