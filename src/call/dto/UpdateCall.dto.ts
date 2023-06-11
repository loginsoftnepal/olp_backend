import { IsOptional, IsString } from 'class-validator';

export class UpdateCallDto {
  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  id: string;
}
