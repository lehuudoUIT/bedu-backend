import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Lesson, User])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
