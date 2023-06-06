import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePrefDto {
  @Transform((value) => String(value))
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  minAge: string;

  @Transform((value) => String(value))
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  maxAge: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  maritalStatus: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  minHeight: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  maxHeight: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  religion: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  caste: string;

  @IsOptional()
  @IsString()
  subcaste: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  motherTongue: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  education: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  annualIncome: string;
}
