export class CreateNotificationDto {
  type: string;
  senderId: number;
  receiverId: number;
  content: string;
  options: string;
}
