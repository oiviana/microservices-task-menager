import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskMessageDto } from './dto/create-task-message.dto';
import { UpdateTaskMessageDto } from './dto/update-task-message.dto';
import { FindAllTasksMessageDto } from './dto/find-all-tasks-message.dto';
import { FindOneTaskMessageDto } from './dto/find-one-task-message.dto';
import { CustomLogger } from '@repo/logger';

@Controller()
export class TasksController {
  private readonly context = TasksController.name;

  constructor(
    private readonly tasksService: TasksService,
    private readonly logger: CustomLogger,
  ) {}

  @MessagePattern('task.create')
  create(@Payload() payload: CreateTaskMessageDto) {
    this.logger.log(`Evento recebido: task.create`, this.context);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, this.context);

    return this.tasksService.create({
      ...payload,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    });
  }

  @MessagePattern('task.findAll')
  findAll(@Payload() payload?: FindAllTasksMessageDto) {
    this.logger.log(`Evento recebido: task.findAll`, this.context);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, this.context);

    return this.tasksService.findAll(
      payload?.page ?? 1,
      payload?.size ?? 10,
    );
  }

  @MessagePattern('task.findOne')
  findOne(@Payload() payload: FindOneTaskMessageDto) {
    this.logger.log(`Evento recebido: task.findOne`, this.context);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, this.context);

    return this.tasksService.findOne(payload.id);
  }

  @MessagePattern('task.update')
  update(@Payload() payload: UpdateTaskMessageDto) {
    this.logger.log(`Evento recebido: task.update`, this.context);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, this.context);

    return this.tasksService.update(payload.id, {
      ...payload.data,
      dueDate: payload.data?.dueDate
        ? new Date(payload.data.dueDate)
        : undefined,
    });
  }

  @MessagePattern('task.remove')
  remove(@Payload() payload: FindOneTaskMessageDto) {
    this.logger.log(`Evento recebido: task.remove`, this.context);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, this.context);

    return this.tasksService.remove(payload.id);
  }
}
