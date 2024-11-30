export class InsertNotificationDto {
  type: string;
  senderId: number;
  receiverId: number;
  content: string;
  options?: string; // Object type. Keys are string and values can be any types
}
