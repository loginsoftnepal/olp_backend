import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePrefDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  minAge: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  maxAge: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  maritalStatus: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  religion: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  caste: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subcaste: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  education: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  education_sub: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  occupation: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country: string;
}
