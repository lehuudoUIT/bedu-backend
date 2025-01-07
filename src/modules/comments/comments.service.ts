import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../entities/comment.entity';
import { Lesson } from '../../entities/lesson.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const { lessonId, userId, content, parentCommentId } = createCommentDto;

    let rightValue: number = 1;

    let parentComment: Comment;

    if (parentCommentId) {
      //! Reply comment
      //! Find parent comment
      parentComment = await this.commentRepository.findOneBy({
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

      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      }
    }

    let leftValue: number = rightValue;
    rightValue += 1;

    const lesson = await this.lessonRepository.findOneBy({ id: lessonId });
    const user = await this.userRepository.findOneBy({ id: userId });

    const new_comment = await this.commentRepository.insert({
      lesson,
      user,
      content,
      left: leftValue,
      right: rightValue,
      parent: parentComment,
    });

    return new_comment;
  }

  async getCommentsByParentId(
    parentCommentId: number = null,
    lessonId: number,
    limit: number = 50,
    offset: number = 0, //skip
  ) {
    if (Number(parentCommentId)) {
      const parent = await this.commentRepository.findOneBy({
        id: parentCommentId,
      });
      if (!parent) throw new NotFoundException('Not found comment for lesson!');
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .select([
          'comment.left',
          'comment.id',
          'comment.right',
          'comment.content',
          'comment.lessonId',
          'comment.createdAt',
        ])
        .where('comment.lessonId = :lessonId', { lessonId })
        .andWhere('comment.parentId = :parentCommentId', { parentCommentId })
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.children', 'children')
        .orderBy('comment.left', 'ASC')
        .getMany();

      const response = comments.map((comment) => {
        return {
          commentId: comment.id,
          username: comment.user.name,
          content: comment.content,
          commentTime: comment.createdAt,
          hasChildren: comment.children?.length > 0 ? true : false,
        };
      });

      return response;
    } else {
      parentCommentId = null;

      //! root comment
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .select([
          'comment.left',
          'comment.id',
          'comment.right',
          'comment.content',
          'comment.lessonId',
          'comment.createdAt',
        ])
        .where('comment.lessonId = :lessonId', { lessonId })
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.children', 'children')
        .orderBy('comment.left', 'ASC')
        .getMany();

      const response = comments.map((comment) => {
        return {
          commentId: comment.id,
          username: comment.user?.name || 'Anonymous',
          content: comment.content,
          commentTime: comment.createdAt,
          hasChildren: comment.children?.length > 0 ? true : false,
        };
      });
      return response;
    }
  }

  async deleteComments(commentId: number, lessonId: number) {
    //1. Check lesson exists in database
    const foundLesson = await this.lessonRepository.findOneBy({
      id: lessonId,
    });

    if (!foundLesson) throw new NotFoundException('Lesson not found!');
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
