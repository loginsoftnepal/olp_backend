import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  isString,
} from 'class-validator';

export class updateProfileDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  height: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sex: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  religion: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  caste: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  subcaste: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  gotra: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  language: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  martial_status: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  dateOfBirth: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  smokeOrdrink: string;
}
