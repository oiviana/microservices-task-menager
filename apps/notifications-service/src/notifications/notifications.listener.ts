import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from './entities/notification.entity';
import { TaskCreatedPayloadDto } from './dto/task-created.dto';
import { TaskUpdatedPayloadDto } from './dto/task-updated.dto';
import { TaskStatusChangedPayloadDto } from './dto/task-status-changed.dto';
import { CommentAddedPayloadDto } from './dto/comment-added.dto';
import { TaskAssignedPayloadDto } from './dto/task-assigned.dto';

@Controller()
export class NotificationsListener {
  private readonly logger = new Logger(NotificationsListener.name);

  constructor(
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @MessagePattern('task.created')
  handleTaskCreated(@Payload() data: TaskCreatedPayloadDto) {
    this.logger.log(`Task criada: ${data.id}`);
    const notification = this.buildNotification(
      data.assignedUserId,
      `Nova tarefa criada: ${data.title}`,
      'task_created',
      data.id,
    );
    this.notificationsGateway.sendNotification(notification);
  }

  @MessagePattern('task.updated')
  handleTaskUpdated(@Payload() data: TaskUpdatedPayloadDto) {
    this.logger.log(`Task atualizada: ${data.id}`);
    const notification = this.buildNotification(
      data.assignedUserId,
      `Tarefa atualizada: ${data.title}`,
      'task_updated',
      data.id,
    );
    this.notificationsGateway.sendNotification(notification);
  }

  @MessagePattern('task.status_changed')
  handleTaskStatusChanged(@Payload() data: TaskStatusChangedPayloadDto) {
    this.logger.log(`Status da task alterado: ${data.id} → ${data.newStatus}`);
    const notification = this.buildNotification(
      data.assignedUserId,
      `Status alterado para: ${data.newStatus}`,
      'status_changed',
      data.id,
    );
    this.notificationsGateway.sendNotification(notification);
  }

  @MessagePattern('comment.added')
  handleCommentAdded(@Payload() data: CommentAddedPayloadDto) {
    this.logger.log(`Comentário adicionado na task: ${data.taskId}`);
    const notification = this.buildNotification(
      data.targetUserId,
      `Novo comentário: ${data.content}`,
      'comment_added',
      data.taskId,
    );
    this.notificationsGateway.sendNotification(notification);
  }

  @MessagePattern('task.assigned')
  handleTaskAssigned(@Payload() data: TaskAssignedPayloadDto) {
    this.logger.log(`Task atribuída ao usuário: ${data.assignedUserId}`);
    const notification = this.buildNotification(
      data.assignedUserId,
      `Tarefa atribuída a você: ${data.taskTitle}`,
      'task_assigned',
      data.taskId,
    );
    this.notificationsGateway.sendNotification(notification);
  }

  private buildNotification(
    userId: string,
    message: string,
    type: string,
    taskId?: string,
  ): Notification {
    const notification = new Notification();
    notification.userId = userId;
    notification.message = message;
    notification.type = type as any;
    notification.taskId = taskId;
    return notification;
  }
}
