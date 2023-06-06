import { IsNotEmpty } from 'class-validator';

export class CreateConnectionRequestDto {
  @IsNotEmpty()
  userId: string;
}
