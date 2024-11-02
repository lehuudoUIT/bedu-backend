export class CreateCommentDto {
  lessonId: number;
  userId: number;
  content: string;
  parentCommentId: number;
}
