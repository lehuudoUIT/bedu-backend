export class CreateProgramDto {
  // The IELTS programs start with PI.
  // The TOEIC programs start with PT.
  // The TOEFL programs start with PF.
  code: string;
  title: string;
  //classId: number;
  description: string;
  sessionQuantity: number;
  courseId: number[];

  // type is in  toeic, ielts, toefl
  type: string;
}
