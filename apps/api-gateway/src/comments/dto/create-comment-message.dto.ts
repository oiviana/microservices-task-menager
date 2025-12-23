import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';

export class CreateCommentMessageDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da tarefa',
    format: 'uuid'
  })
  @IsUUID()
  taskId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID do autor do comentário',
    format: 'uuid'
  })
  @IsUUID()
  authorId: string;

  @ApiProperty({
    example: 'Este é um comentário sobre a tarefa...',
    description: 'Conteúdo do comentário'
  })
  @IsString()
  body: string;
}