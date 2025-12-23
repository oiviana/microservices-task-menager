import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskMessageDto } from './dto/create-task-message.dto';
import { UpdateTaskMessageDto } from './dto/update-task-message.dto';
import { FindAllTasksMessageDto } from './dto/find-all-tasks-message.dto';
import { FindOneTaskMessageDto } from './dto/find-one-task-message.dto';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('task.create')
  create(@Payload() payload: CreateTaskMessageDto) {
    return this.tasksService.create({
      ...payload,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    });
  }

  @MessagePattern('task.findAll')
  findAll(@Payload() payload?: FindAllTasksMessageDto) {
    return this.tasksService.findAll(
      payload?.page ?? 1,
      payload?.size ?? 10,
    );
  }

  @MessagePattern('task.findOne')
  findOne(@Payload() payload: FindOneTaskMessageDto) {
    return this.tasksService.findOne(payload.id);
  }

  @MessagePattern('task.update')
  update(@Payload() payload: UpdateTaskMessageDto) {
    return this.tasksService.update(payload.id, {
      ...payload.data,
      dueDate: payload.data?.dueDate
        ? new Date(payload.data.dueDate)
        : undefined,
    });
  }

  @MessagePattern('task.remove')
  remove(@Payload() payload: FindOneTaskMessageDto) {
    return this.tasksService.remove(payload.id);
  }
}
