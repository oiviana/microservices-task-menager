import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { TaskPriority } from "../types/task-priority.enum";
import { TaskStatus } from "../types/task-status.enum";

export class UpdateTaskDataDto {
  @ApiPropertyOptional({
    example: 'Implementar autenticação - Atualizado',
    description: 'Novo título da tarefa (opcional)'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Implementar sistema de autenticação JWT com refresh tokens e OAuth2',
    description: 'Nova descrição detalhada da tarefa (opcional)'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '2024-12-31T23:59:59.999Z',
    description: 'Nova data de vencimento da tarefa (opcional)',
    format: 'date-time'
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    description: 'Nova prioridade da tarefa (opcional)'
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    description: 'Novo status da tarefa (opcional)'
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID do usuário designado para a tarefa (opcional)',
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}