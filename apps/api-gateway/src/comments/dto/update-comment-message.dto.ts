import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCommentMessageDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'ID do comentário',
    format: 'uuid'
  })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({
    example: 'Comentário atualizado...',
    description: 'Novo conteúdo do comentário (opcional)'
  })
  @IsOptional()
  @IsString()
  body?: string;
}