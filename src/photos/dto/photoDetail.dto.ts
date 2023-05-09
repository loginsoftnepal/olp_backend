import { IsOptional } from 'class-validator';

export class PhotoDetailDto {
  @IsOptional()
  picture1: string;

  @IsOptional()
  picture2: string;

  @IsOptional()
  picture3: string;

  @IsOptional()
  picture4: string;

  @IsOptional()
  picture5: string;
}
