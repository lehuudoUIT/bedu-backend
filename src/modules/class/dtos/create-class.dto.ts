export class CreateClassDto {
  code: string;
  name: string;
  studyForm: string;
  startDate: Date;
  description: string;
  lessonQuality: number;
  timePerLesson: number;
  type: string;
  price: number;
  isPublic: boolean;
}
