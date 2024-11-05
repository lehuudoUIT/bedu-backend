export class CreateCourseDto {
  courseType: string;
  code: string;
  title: string;
  description: string;
  image: string;
  lessonQuantity: number;
  timePerLesson: number;
  price: number;
  isPublic: boolean;
}
