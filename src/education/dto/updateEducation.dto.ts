import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export default class UpdateEducationDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  education_degree: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  subject: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  college: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  occupation: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  sector: string;

  @IsNotEmpty()
  @IsOptional()
  annualIncome: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  companyName: string;
}
