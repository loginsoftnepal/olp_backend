import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
