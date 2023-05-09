import { IsNotEmpty, IsString } from 'class-validator';

class TokenVerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export default TokenVerificationDto;
