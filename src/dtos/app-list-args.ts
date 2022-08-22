import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class AppListArgs {
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  limit?: number = 100;

  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}
