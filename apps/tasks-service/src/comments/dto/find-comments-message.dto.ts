import { IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class FindCommentsMessageDto {
  @IsUUID()
  taskId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  size?: number;
}
