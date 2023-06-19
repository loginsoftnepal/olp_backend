import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailScheduleDto {
  @IsEmail()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  html: string;

  @IsDateString()
  date: Date;
}

export default EmailScheduleDto;
