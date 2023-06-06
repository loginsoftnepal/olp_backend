import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePrefDto {
  @IsString()
  @IsNotEmpty()
  minAge: string;

  @IsString()
  @IsNotEmpty()
  maxAge: string;

  @IsString()
  @IsNotEmpty()
  maritalStatus: string;

  @IsString()
  @IsNotEmpty()
  maxHeight: string;

  @IsString()
  @IsNotEmpty()
  minHeight: string;

  @IsString()
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
  motherTongue: string;

  @IsString()
  @IsNotEmpty()
  education: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  occupation: string;

  @IsString()
  @IsNotEmpty()
  annualIncome: string;

  @IsString()
  @IsNotEmpty()
  sector: string;
}
