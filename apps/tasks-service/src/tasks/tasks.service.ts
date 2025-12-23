import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskStatus } from './types/task-status.enum';
import { TaskPriority } from './types/task-priority.enum';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  // CREATE
  async create(data: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: TaskPriority;
    createdBy: string;
  }): Promise<Task> {
    const task = this.taskRepository.create({
      ...data,
      status: TaskStatus.TODO,
    });

    const saved = await this.taskRepository.save(task);

    // Audit log de criação
    await this.auditLogsService.create({
      entity: 'task',
      entityId: saved.id,
      action: 'create',
      message: `Task criada com status ${saved.status}`,
      actorId: data.createdBy,
    });

    return saved;
  }

  // GET ALL (paginação)
  async findAll(page = 1, size = 10) {
    const [items, total] = await this.taskRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      items,
      meta: {
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
      },
    };
  }

  // GET BY ID
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  // UPDATE
  async update(
    id: string,
    data: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>,
    actorId?: string,
  ): Promise<Task> {
    const task = await this.findOne(id);

    Object.assign(task, data);
    const updated = await this.taskRepository.save(task);

    // Audit log de atualização
    await this.auditLogsService.create({
      entity: 'task',
      entityId: updated.id,
      action: 'update',
      message: `Task atualizada. Status atual: ${updated.status}`,
      actorId: actorId ?? updated.createdBy,
    });

    return updated;
  }

  // DELETE
  async remove(id: string, actorId?: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);

    // Audit log de remoção
    await this.auditLogsService.create({
      entity: 'task',
      entityId: id,
      action: 'delete',
      message: `Task deletada`,
      actorId: actorId ?? task.createdBy,
    });
  }
}
