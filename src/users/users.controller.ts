import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import ForgetPasswordDto from './dto/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from './dto/fileUpload.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  @UseGuards(JwtAuthenticationGuard)
  async updateUser(
    @Body() newUserDetail: UpdateUserDto,
    @Req() request: RequestWithUser,
  ) {
    return this.usersService.updateUser(request.user.id, newUserDetail);
  }

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new avatar for the user',
    type: FileUploadDto,
  })
  async addAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addAvatar(
      request.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Post('password/forget')
  async forgetPassword(@Body() forgetPass: ForgetPasswordDto) {
    const user = await this.usersService.getByEmail(forgetPass.email);
    if (user.isGoogleAuth) {
      throw new HttpException('Cannot change password', HttpStatus.NOT_FOUND);
    }

    await this.usersService.forgetPassword(user);
  }

  @Post('password/reset')
  async resetPassword(
    @Body() reset: ResetPasswordDto,
    @Param('token') token: string,
  ) {
    return await this.usersService.resetPassword(reset, token);
  }
}
