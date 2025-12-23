import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCommentMessageDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  body?: string;
}
