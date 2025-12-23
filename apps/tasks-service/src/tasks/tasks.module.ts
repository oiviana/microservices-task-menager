import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { RabbitMQPublisher } from '@/infra/rabbitmq.publisher';
import { AuditLogsModule } from '@/audit-logs/audit-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuditLogsModule
  ],
  controllers: [TasksController],
  providers: [TasksService, RabbitMQPublisher],
})
export class TasksModule { }
