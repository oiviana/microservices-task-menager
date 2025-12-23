import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTaskMessageDto } from './dto/create-task-message.dto';
import { UpdateTaskMessageDto } from './dto/update-task-message.dto';


@Controller('tasks')
export class TasksController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
  ) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('size') size?: number) {
    return this.tasksClient.send('task.findAll', { page, size });
  }

  @Post()
  create(@Body() dto: CreateTaskMessageDto) {
    return this.tasksClient.send('task.create', dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksClient.send('task.findOne', { id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskMessageDto) {
    return this.tasksClient.send('task.update', { id, data: dto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksClient.send('task.remove', { id });
  }
}
