import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateCallDto {
  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  status: string;
}
