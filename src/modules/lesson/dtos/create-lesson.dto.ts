export class CreateLessonDto {
  startDate: Date;
  endDate: Date;
  type: string;
  videoUrl: string;
  classId?: number;
  courseId?: number;
  examId?: number;
  teacherId: number;
}

export class CreateRecurringLessonDto {
  classId: number;
  teacherId: number;
  // google's api properties
  summary: string;
  description: string;
  startDate: string; // Ngày bắt đầu do người dùng chọn
  startTime: string; // Giờ bắt đầu (HH:mm)
  endTime: string; // Giờ kết thúc (HH:mm)
  selectedDays: string[]; // ['Mon', 'Wed', 'Fri']
  weeks: number; // Số tuần lặp lại
  attendees: { email: string }[];
}
