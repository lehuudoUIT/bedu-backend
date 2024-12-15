export class CreateCourseDto {
  courseType: string;
  title: string;
  description: string;
  image: string;
  lessonQuantity: number;
  timePerLesson: number;
  price: number;
  programId: number[];
  isActive?: boolean;
}
