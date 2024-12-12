import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../entities/comment.entity';
import { Lesson } from '../../entities/lesson.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
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
          right: () => 'right + 2', // Tăng right lên 2 đơn vị
        })
        .where('lessonId = :lessonId', { lessonId }) // Điều kiện comment_lessonId
        .andWhere('right >= :rightValue', { rightValue }) // Điều kiện comment_right lớn hơn hoặc bằng rightValue
        .execute();

      await this.commentRepository
        .createQueryBuilder()
        .update(Comment)
        .set({
          left: () => 'left + 2', // Tăng left lên 2 đơn vị
        })
        .where('lessonId = :lessonId', { lessonId }) // Điều kiện comment_lessonId
        .andWhere('left > :rightValue', { rightValue }) // Điều kiện comment_right lớn hơn hoặc bằng rightValue
        .execute();
    } else {
      const maxRightValue = await this.commentRepository
        .createQueryBuilder('comment')
        .where('comment.lessonId = :lessonId', { lessonId })
        .orderBy('comment.right', 'DESC')
        .getOne();

      console.log('Max right value:');
      console.log(maxRightValue);

      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      }
    }

    let leftValue = rightValue;
    rightValue += 1;

    const new_comment = await this.commentRepository.insert({
     // lessonId,
      //userId,
      content,
      left: leftValue,
      right: rightValue,
      //parentId: parentCommentId,
    });

    return new_comment;
  }

  async getCommentsByParentId({
    parentCommentId = null,
    lessonId,
    limit = 50,
    offset = 0, //skip
  }) {
    if (parentCommentId) {
      const parent = await this.commentRepository.findOneBy({
        id: parentCommentId,
      });
      if (!parent)
        throw new NotFoundException('Not found comment for product!');
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .select([
          'comment.left',
          'comment.right',
          'comment.content',
          'comment.lessonId',
        ])
        .where('comment.lessonId = :lessonId', { lessonId })
        .andWhere('comment.parentId = :parentCommentId', { parentCommentId })
        .orderBy('comment.left', 'ASC')
        .getMany();
      return comments;
    } else {
      //! root comment
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .select([
          'comment.left',
          'comment.right',
          'comment.content',
          'comment.parentId',
        ])
        .orderBy('comment.left', 'ASC')
        .getMany();

      return comments;
    }
  }

  async deleteComments({ commentId, lessonId }) {
    //1. Check product exists in database
    const foundProduct = await this.lessonRepository.findOneBy({
      id: lessonId,
    });

    if (!foundProduct) throw new NotFoundException('Product not found!');
    //1. Xac dinh gia tri left, right cua comment
    const parentComment = await this.commentRepository.findOneBy({
      id: commentId,
    });
    if (!parentComment) throw new NotFoundException('Comment not found!');

    const leftValue = parentComment.left;
    const rightValue = parentComment.right;
    //2. Tinh width
    const width = rightValue - leftValue + 1;

    //3. Xoa comment cha va con
    await this.commentRepository
      .createQueryBuilder('comment')
      .delete()
      .where('comment.lessonId = :lessonId', { lessonId })
      .andWhere('comment.left >= :leftValue', { leftValue })
      .andWhere('comment.left < :rightValue', { rightValue })
      .execute();

    //4. Update cac comment ben phai comment hien tai tru di so node bi xoa
    await this.commentRepository
      .createQueryBuilder('comment')
      .update()
      .set({ left: () => `left - ${width}`, right: () => `right - ${width}` })
      .where('comment.lessonId = :lessonId', { lessonId })
      .andWhere('comment.left < :rightValue', { rightValue })
      .execute();
    return true;
  }
}
