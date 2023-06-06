import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateEducationDto {
  @IsNotEmpty()
  @IsString()
  education_degree: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  college: string;

  @IsNotEmpty()
  @IsString()
  occupation: string;

  @IsNotEmpty()
  @IsNumber()
  annualIncome: number;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  sector: string;
}
