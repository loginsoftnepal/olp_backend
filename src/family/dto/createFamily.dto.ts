import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, isString } from 'class-validator';

export default class CreateFamilyDto {
  @IsNotEmpty()
  @IsString()
  familyType: string;

  @IsNotEmpty()
  @IsString()
  noOfSiblings: string;

  @IsNotEmpty()
  @IsString()
  noOfFamilyMember: string;

  @IsNotEmpty()
  @IsString()
  noOfUnmarried: string;

  @IsNotEmpty()
  @IsString()
  liveWithFamily: string;

  @IsNotEmpty()
  @IsString()
  familyValues: string;

  @IsNotEmpty()
  @IsString()
  gotra: string;

  @IsNotEmpty()
  @IsString()
  parentStatus: string;

  @IsNotEmpty()
  @IsString()
  familyAddress: string;

  @IsNotEmpty()
  @IsString()
  nativePlace: string;

  @IsNotEmpty()
  @IsString()
  motherTongue: string;
}
