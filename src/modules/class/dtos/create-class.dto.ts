export class CreateClassDto {
  code: string;
  name: string;
  studyForm: string;
  startDate: Date;
  description: string;
  lessonQuality: number;
  timePerLesson: number;
  price: number;
  isPublic: boolean;
}
