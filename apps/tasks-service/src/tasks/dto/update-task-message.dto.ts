import { Type } from 'class-transformer';
import { ValidateNested, IsUUID } from 'class-validator';
import { UpdateTaskDataDto } from './update-taskdata-dto';

export class UpdateTaskMessageDto {
  @IsUUID()
  id: string;

  @ValidateNested()
  @Type(() => UpdateTaskDataDto)
  data: UpdateTaskDataDto;
}
