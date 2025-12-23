import { IsUUID, IsString } from 'class-validator';

export class CreateCommentMessageDto {
  @IsUUID()
  taskId: string;

  @IsUUID()
  authorId: string;

  @IsString()
  body: string;
}
