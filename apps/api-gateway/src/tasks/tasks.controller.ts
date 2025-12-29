import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CustomLogger } from '@repo/logger';
import { CreateTaskMessageDto } from './dto/create-task-message.dto';
import { UpdateTaskMessageDto } from './dto/update-task-message.dto';


@Controller('tasks')
export class TasksController {
  private readonly context = TasksController.name;
  constructor(
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
    private readonly logger: CustomLogger,
  ) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('size') size?: number) {
    this.logger.log(`Evento recebido: task.findAll`, this.context);
    return this.tasksClient.send('task.findAll', { page, size });
  }

  @Post()
  create(@Body() dto: CreateTaskMessageDto) {
    this.logger.log(`Evento recebido: task.create`, this.context);
    return this.tasksClient.send('task.create', dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Evento recebido: task.findOne`, this.context);
    return this.tasksClient.send('task.findOne', { id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskMessageDto) {
    this.logger.log(`Evento recebido: task.update`, this.context);
    return this.tasksClient.send('task.update', { id, data: dto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Evento recebido: task.remove`, this.context);
    return this.tasksClient.send('task.remove', { id });
  }
}
