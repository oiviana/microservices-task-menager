import { TaskStatus } from '../../../../tasks-service/src/tasks/types/task-status.enum';
import { NotificationEvent } from './notification-event.interface';

export type TaskCreatedEvent = NotificationEvent<{
  title: string;
  status: TaskStatus;
}>;

export type TaskUpdatedEvent = NotificationEvent<{
  oldStatus?: TaskStatus;
  newStatus?: TaskStatus;
}>;
