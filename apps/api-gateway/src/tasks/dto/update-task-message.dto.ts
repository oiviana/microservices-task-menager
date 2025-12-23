import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsUUID } from 'class-validator';
import { UpdateTaskDataDto } from './update-taskdata-dto';

export class UpdateTaskMessageDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da tarefa',
    format: 'uuid'
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: UpdateTaskDataDto,
    description: 'Dados para atualização da tarefa'
  })
  @ValidateNested()
  @Type(() => UpdateTaskDataDto)
  data: UpdateTaskDataDto;
}