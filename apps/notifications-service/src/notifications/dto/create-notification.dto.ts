export class CreateNotificationDto {
  userId: string;
  message: string;
  taskId?: string;
  type: 'ASSIGNED' | 'STATUS_CHANGED' | 'COMMENT';
  createdAt?: Date;
}