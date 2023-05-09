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
  @IsBoolean()
  @IsOptional()
  job: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  selfEmployed: boolean;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  monthlySalary: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  annualIncome: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  foreignEmployment: boolean;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  country: string;
}
