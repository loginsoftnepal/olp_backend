import { IsNotEmpty, IsOptional, IsString, isNotEmpty } from 'class-validator';

export default class UpdateFamilyDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  familyType: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  noOfSiblings: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  noOfFamilyMember: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  noOfUnmarried: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  liveWithFamily: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  familyValues: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  gotra: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  parentStatus: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  familyAddress: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  nativePlace: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  motherTongue: string;
}
