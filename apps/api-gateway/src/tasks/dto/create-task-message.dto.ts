import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { TaskPriority } from '../types/task-priority.enum';

export class CreateTaskMessageDto {
  @ApiProperty({
    example: 'Implementar autenticação',
    description: 'Título da tarefa'
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Implementar sistema de autenticação JWT com refresh tokens',
    description: 'Descrição detalhada da tarefa (opcional)'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '2024-12-31T23:59:59.999Z',
    description: 'Data de vencimento da tarefa (opcional)',
    format: 'date-time'
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    description: 'Prioridade da tarefa'
  })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID do usuário que criou a tarefa',
    format: 'uuid'
  })
  @IsUUID()
  createdBy: string;
}