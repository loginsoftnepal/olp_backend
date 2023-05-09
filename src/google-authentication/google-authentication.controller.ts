import {
  ClassSerializerInterceptor,
  Controller,
  Req,
  UseInterceptors,
  Body,
  Post,
} from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import TokenVerificationDto from './dto/tokenVerification.dto';
import { Request } from 'express';

@Controller('google-authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  async authenticate(
    @Body() tokenData: TokenVerificationDto,
    @Req() request: Request,
  ) {
    const { accessTokenCookie, refreshTokenCookie, user } =
      await this.googleAuthenticationService.authenticate(tokenData.token);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return user;
  }
}
