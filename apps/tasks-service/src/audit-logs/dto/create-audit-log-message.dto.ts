import { IsEnum, IsUUID, IsString } from 'class-validator';

export class CreateAuditLogMessageDto {
  @IsEnum(['task', 'comment'])
  entity: 'task' | 'comment';

  @IsUUID()
  entityId: string;

  @IsEnum(['create', 'update', 'delete'])
  action: 'create' | 'update' | 'delete';

  @IsString()
  message: string;

  @IsUUID()
  actorId: string;
}
