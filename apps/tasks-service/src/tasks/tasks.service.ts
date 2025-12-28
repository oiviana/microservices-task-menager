import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskStatus } from './types/task-status.enum';
import { TaskPriority } from './types/task-priority.enum';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { RabbitMQPublisher } from '../infra/rabbitmq.publisher';
import {
  TaskCreatedEvent,
  TaskUpdatedEvent,
} from './types/task-events';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly auditLogsService: AuditLogsService,
    private readonly rabbitMQPublisher: RabbitMQPublisher,
  ) {}

  // CREATE
  async create(data: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: TaskPriority;
    createdBy: string;
    assigneeId?: string;
  }): Promise<Task> {
    const task = this.taskRepository.create({
      ...data,
      status: TaskStatus.TODO,
    });

    const saved = await this.taskRepository.save(task);

    await this.auditLogsService.create({
      entity: 'task',
      entityId: saved.id,
      action: 'create',
      message: `Task criada com status ${saved.status}`,
      actorId: data.createdBy,
    });

    // publish event: task.created
    await this.rabbitMQPublisher.publish<TaskCreatedEvent['payload']>({
      type: 'task.created',
      taskId: saved.id,
      actorId: data.createdBy,
      recipients: saved.assigneeId ? [saved.assigneeId] : [],
      payload: {
        title: saved.title,
        status: saved.status,
      },
      occurredAt: new Date().toISOString(),
    });

    return saved;
  }

  // UPDATE
  async update(
    id: string,
    data: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>,
    actorId?: string,
  ): Promise<Task> {
    const task = await this.findOne(id);

    const previousStatus = task.status;
    const previousAssigneeId = task.assigneeId;

    Object.assign(task, data);
    const updated = await this.taskRepository.save(task);

    await this.auditLogsService.create({
      entity: 'task',
      entityId: updated.id,
      action: 'update',
      message: `Task atualizada. Status atual: ${updated.status}`,
      actorId: actorId ?? updated.createdBy,
    });

    // publish event: task.updated
    if (previousStatus !== updated.status) {
      await this.rabbitMQPublisher.publish<TaskUpdatedEvent['payload']>({
        type: 'task.status_changed',
        taskId: updated.id,
        actorId: actorId ?? updated.createdBy,
        recipients: updated.assigneeId ? [updated.assigneeId] : [],
        payload: {
          oldStatus: previousStatus,
          newStatus: updated.status,
        },
        occurredAt: new Date().toISOString(),
      });
    }

    //  task.assigned (payload vazio → sem generic)
    if (
      updated.assigneeId &&
      previousAssigneeId !== updated.assigneeId
    ) {
      await this.rabbitMQPublisher.publish({
        type: 'task.assigned',
        taskId: updated.id,
        actorId: actorId ?? updated.createdBy,
        recipients: [updated.assigneeId],
        payload: {},
        occurredAt: new Date().toISOString(),
      });
    }

    return updated;
  }

  // todas as tasks com paginação
  async findAll(page: number = 1, size: number = 10): Promise<{ data: Task[]; total: number; page: number; size: number }> {
    const skip = (page - 1) * size;
    
    const [data, total] = await this.taskRepository.findAndCount({
      relations: ['comments'],
      skip,
      take: size,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      size,
    };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async remove(id: string, actorId?: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);

    await this.auditLogsService.create({
      entity: 'task',
      entityId: id,
      action: 'delete',
      message: `Task deletada`,
      actorId: actorId ?? task.createdBy,
    });
  }
}
