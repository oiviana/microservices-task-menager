import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [TasksModule, CommentsModule, AuditLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
