export class NotificationDto {
  notiType: string;
  sendingType: 'email' | 'sms' | 'push';
  senderId: number;
  receiverId: number;
  content: string;
  subject?: string; // use when sending email
  data?: Record<string, any>; // use when push notification
  options?: Record<string, any>; // Object type. Keys are string and values can be any types
}
