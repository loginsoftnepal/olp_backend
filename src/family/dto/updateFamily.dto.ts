import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class UpdateFamilyDto {
  @IsNotEmpty()
  @IsString()
  mobile: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  familyType: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fatherOccupation: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  motherOccupation: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  noOfBrother: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  noOfSister: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  noOfFamilyMember: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  noOfUmnarried: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  municipality: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  district: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  province: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  country: string;
}
