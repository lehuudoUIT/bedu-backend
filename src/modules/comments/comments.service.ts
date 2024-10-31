import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const { lessonId, userId, content, parentCommentId } = createCommentDto;

    let rightValue = 1;

    if (parentCommentId) {
      //! Reply comment
      //! Find parent comment
      const parentComment = await this.commentRepository.findOneBy({
        id: parentCommentId,
      });
      if (!parentComment)
        throw new NotFoundException('Comment does not exist!');

      rightValue = parentComment.right;

      await this.commentRepository
        .createQueryBuilder()
        .update(Comment)
        .set({
          right: () => 'comment_right + 2', // Tăng comment_right lên 2 đơn vị
        })
        .where('lessonId = :lessonId', { lessonId }) // Điều kiện comment_productId
        .andWhere('right >= :rightValue', { rightValue }) // Điều kiện comment_right lớn hơn hoặc bằng rightValue
        .execute();

      await this.commentRepository
        .createQueryBuilder()
        .update(Comment)
        .set({
          left: () => 'left + 2', // Tăng left lên 2 đơn vị
        })
        .where('lessonId = :lessonId', { lessonId }) // Điều kiện comment_productId
        .andWhere('left > :rightValue', { rightValue }) // Điều kiện comment_right lớn hơn hoặc bằng rightValue
        .execute();
    } else {
      const maxRightValue = await this.commentRepository
        .createQueryBuilder()
        .where('lessonId = :lessonId', { lessonId })
        .orderBy('right', 'DESC')
        .getOne();

      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      }
    }

    let leftValue = rightValue;
    rightValue += 1;

    const new_comment = await this.commentRepository.insert({
      lessonId,
      userId,
      content,
      left: leftValue,
      right: rightValue,
      parentId: parentCommentId,
    });

    return new_comment;
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
