import { IsNotEmpty, IsString } from 'class-validator';

export default class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
