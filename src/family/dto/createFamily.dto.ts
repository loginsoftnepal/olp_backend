import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateFamilyDto {
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  familyType: string;

  @IsNotEmpty()
  @IsString()
  fatherOccupation: string;

  @IsNotEmpty()
  @IsString()
  motherOccupation: string;

  @IsNotEmpty()
  @IsNumber()
  noOfBrother: number;

  @IsNotEmpty()
  @IsNumber()
  noOfSister: number;

  @IsNotEmpty()
  @IsNumber()
  noOfFamilyMember: number;

  @IsNotEmpty()
  @IsNumber()
  noOfUmnarried: number;

  @IsNotEmpty()
  @IsString()
  municipality: string;

  @IsNotEmpty()
  @IsString()
  district: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}
