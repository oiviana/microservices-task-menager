import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { TaskPriority } from "../types/task-priority.enum";
import { TaskStatus } from "../types/task-status.enum";

export class UpdateTaskDataDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
