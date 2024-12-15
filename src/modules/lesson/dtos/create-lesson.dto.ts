export class CreateLessonDto {
  startDate: Date;
  endDate: Date;
  type: string;
  videoUrl: string;
  classId?: number;
  courseId: number;
  examId?: number;
  teacherId?: number;
}
