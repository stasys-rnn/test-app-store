import { IsDefined, IsInt, Min } from 'class-validator';

export class SingleItemArgs {
  @IsInt()
  @Min(0)
  @IsDefined()
  id: number;
}
