export class ReScheduleLessonDto {
  classId: number;
  lessonId: number;
  // google's api properties
  startDate: Date; // Ngày bắt đầu do người dùng chọn
  endDate: Date; // Giờ kết thúc (HH:mm)
}
