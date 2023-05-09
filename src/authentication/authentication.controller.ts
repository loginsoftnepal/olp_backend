import {
  Body,
  Controller,
  Get,
  HttpCode,
  Injectable,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import RegisterDto from './dto/Register.dto';
import { AuthenticationService } from './authentication.service';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import JwtRefreshGuard from './jwt-refresh.guard';
import { UsersService } from 'src/users/users.service';
import CreateAdminDto from './dto/requestCreateAdmin.dto';
import { ReturnCreateAdminDto } from './dto/returnCreateAdmin.dto';
import { AdminService } from 'src/admin/admin.service';
import { ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import LoginDto from './dto/login.dto';

@ApiTags('Authentication')
@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
// @SerializeOptions({
//   strategy: 'excludeAll',
// })
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
    private readonly adminService: AdminService,
  ) {}

  @Post('/register')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: RegisterDto })
  async register(
    @Body() registrationData: RegisterDto,
    @Req() request: Request,
  ) {
    const newUser = await this.authenticationService.register(registrationData);
    await this.authenticationService.sendVerificaitonEmail(
      newUser.id,
      newUser.email,
    );
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      newUser.id,
    );
    const { cookie, token } =
      this.authenticationService.getCookieWithJwtRefreshToken(newUser.id);

    await this.usersService.setCurrentRefreshToken(token, newUser.id);

    request.res.setHeader('Set-Cookie', [accessTokenCookie, cookie]);
    return newUser;
  }

  @Post('/register-admin')
  @ApiBody({ type: CreateAdminDto })
  async registerAdmin(
    @Body() adminDetail: CreateAdminDto,
    @Req() request: Request,
  ) {
    const adminresult = await this.authenticationService.registerAdmin(
      adminDetail,
    );
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      adminresult.id,
    );

    const { cookie, token } =
      this.authenticationService.getCookieWithJwtRefreshToken(adminresult.id);

    await this.adminService.setCurrentRefreshToken(token, adminresult.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, cookie]);
    return adminresult;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  @ApiBody({ type: LoginDto })
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      user.id,
    );

    const { cookie, token } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(token, user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, cookie]);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @ApiCookieAuth()
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookiesForLogOut(),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}