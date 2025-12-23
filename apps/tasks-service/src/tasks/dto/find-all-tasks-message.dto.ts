import { IsInt, IsOptional, Min } from 'class-validator';

export class FindAllTasksMessageDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  size?: number;
}
