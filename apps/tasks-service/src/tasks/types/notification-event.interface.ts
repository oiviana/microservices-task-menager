export type NotificationEventType =
  | 'task.created'
  | 'task.updated'
  | 'task.deleted'
  | 'task.assigned'
  | 'task.status_changed'
  | 'task.commented';

export interface NotificationEvent<TPayload = unknown> {
  type: NotificationEventType;
  taskId: string;
  actorId: string;
  recipients: string[];
  payload: TPayload;
  occurredAt: string; // ISO
}
