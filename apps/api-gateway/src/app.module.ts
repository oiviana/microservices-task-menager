import { Module } from '@nestjs/common';
import { AppLoggerModule } from '@repo/logger';
import { AuthModule } from '@/auth/auth.module';
import { TasksModule } from '@/tasks/tasks.module';
import { CommentsModule } from '@/comments/comments.module';

@Module({
  imports: [AppLoggerModule, AuthModule, TasksModule, CommentsModule],
})

export class AppModule {}
