import { IsUUID } from 'class-validator';

export class FindOneCommentMessageDto {
  @IsUUID()
  id: string;
}
