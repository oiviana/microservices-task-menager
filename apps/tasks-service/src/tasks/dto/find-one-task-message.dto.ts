import { IsUUID } from 'class-validator';

export class FindOneTaskMessageDto {
  @IsUUID()
  id: string;
}
