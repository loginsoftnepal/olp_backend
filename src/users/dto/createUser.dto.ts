import { IsDateString, IsString, maxLength, minLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}

export default CreateUserDto;
