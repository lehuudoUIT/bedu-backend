import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'comment',
    possession: 'own',
  })
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return {
      message: 'Create new comment successfully',
      metadata: await this.commentsService.create(createCommentDto),
    };
  }

  @Get('parent/:id')
  async getCommentsByParentId(
    @Param('id') id: number,
    @Query('lessonId') lessonId: number,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return {
      message: 'Get comments by parentId',
      metadata: await this.commentsService.getCommentsByParentId(
        lessonId,
        id,
        limit,
        offset,
      ),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'comment',
    possession: 'any',
  })
  @Delete(':commentId/:lessonId')
  async findOne(
    @Param('commentId') commentId: number,
    @Param('lessonId') lessonId: number,
  ) {
    return {
      message: 'Delete comment successfully',
      metadata: await this.commentsService.deleteComments(commentId, lessonId),
    };
  }
}
