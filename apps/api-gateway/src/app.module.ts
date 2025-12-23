import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { TasksModule } from '@/tasks/tasks.module';
import { CommentsModule } from '@/comments/comments.module';

@Module({
  imports: [AuthModule, TasksModule, CommentsModule],
})

export class AppModule {}
