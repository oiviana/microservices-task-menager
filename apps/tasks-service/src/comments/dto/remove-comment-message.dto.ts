import { IsUUID } from 'class-validator';

export class RemoveCommentMessageDto {
  @IsUUID()
  id: string;
}
