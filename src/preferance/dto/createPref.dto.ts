import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePrefDto {
  @IsNumber()
  @IsNotEmpty()
  minAge: number;

  @IsNumber()
  @IsNotEmpty()
  maxAge: number;

  @IsString()
  @IsNotEmpty()
  maritalStatus: string;

  @IsNumber()
  @IsNotEmpty()
  height: number;

  @IsNumber()
  @IsNotEmpty()
  religion: string;

  @IsString()
  @IsNotEmpty()
  caste: string;

  @IsString()
  @IsNotEmpty()
  subcaste: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  education: string;

  @IsString()
  @IsNotEmpty()
  education_sub: string;

  @IsString()
  @IsNotEmpty()
  occupation: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
