import { IsEnum, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { TaskPriority } from '../types/task-priority.enum';

export class CreateTaskMessageDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsUUID()
  createdBy: string;
}
