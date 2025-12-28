import { Injectable, NotFoundException, Inject } from '@nestjs/common';
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
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly auditLogsService: AuditLogsService,
    private readonly rabbitMQPublisher: RabbitMQPublisher,
    @Inject('PinoLogger')
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TasksService.name);
  }

  // CREATE
  async create(data: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: TaskPriority;
    createdBy: string;
    assigneeId?: string;
  }): Promise<Task> {
    this.logger.info('Criando nova task');
    this.logger.debug(`Payload: ${JSON.stringify(data)}`);

    const task = this.taskRepository.create({
      ...data,
      status: TaskStatus.TODO,
    });

    const saved = await this.taskRepository.save(task);

    this.logger.info(`Task criada com ID: ${saved.id}`);

    await this.auditLogsService.create({
      entity: 'task',
      entityId: saved.id,
      action: 'create',
      message: `Task criada com status ${saved.status}`,
      actorId: data.createdBy,
    });

    this.logger.info('Publicando evento task.created');
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
    this.logger.info(`Atualizando task com ID: ${id}`);
    this.logger.debug(`Payload de atualização: ${JSON.stringify(data)}`);

    const task = await this.findOne(id);

    const previousStatus = task.status;
    const previousAssigneeId = task.assigneeId;

    Object.assign(task, data);
    const updated = await this.taskRepository.save(task);

    this.logger.info(`Task atualizada com ID: ${updated.id}`);

    await this.auditLogsService.create({
      entity: 'task',
      entityId: updated.id,
      action: 'update',
      message: `Task atualizada. Status atual: ${updated.status}`,
      actorId: actorId ?? updated.createdBy,
    });

    // publish event: task.updated
    if (previousStatus !== updated.status) {
      this.logger.info('Status da task mudou, publicando task.status_changed');
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

    if (updated.assigneeId && previousAssigneeId !== updated.assigneeId) {
      this.logger.info('Assignee da task mudou, publicando task.assigned');
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

  // FIND ALL
  async findAll(page: number = 1, size: number = 10): Promise<{ data: Task[]; total: number; page: number; size: number }> {
    this.logger.info(`Buscando todas as tasks, página: ${page}, tamanho: ${size}`);

    const skip = (page - 1) * size;
    const [data, total] = await this.taskRepository.findAndCount({
      relations: ['comments'],
      skip,
      take: size,
      order: { createdAt: 'DESC' },
    });

    this.logger.info(`Encontradas ${data.length} tasks de um total de ${total}`);
    return { data, total, page, size };
  }

  async findOne(id: string): Promise<Task> {
    this.logger.info(`Buscando task com ID: ${id}`);

    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!task) {
      this.logger.warn(`Task com ID ${id} não encontrada`);
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async remove(id: string, actorId?: string): Promise<void> {
    this.logger.info(`Removendo task com ID: ${id}`);

    const task = await this.findOne(id);
    await this.taskRepository.remove(task);

    this.logger.info(`Task removida com sucesso, ID: ${id}`);

    await this.auditLogsService.create({
      entity: 'task',
      entityId: id,
      action: 'delete',
      message: `Task deletada`,
      actorId: actorId ?? task.createdBy,
    });
  }
}
