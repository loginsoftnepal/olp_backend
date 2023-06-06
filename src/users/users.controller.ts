import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
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
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/fileUpload.dto';
import { CreateProfileDto } from 'src/profile/dto/createProfile.dto';
import { updateProfileDto } from 'src/profile/dto/updateProfile.dto';
import { request } from 'http';
import UpdateFamilyDto from 'src/family/dto/updateFamily.dto';
import { UpdatePrefDto } from 'src/preferance/dto/updatePref.dto';
import UpdateEducationDto from 'src/education/dto/updateEducation.dto';
import { string } from 'joi';

@Controller('users')
@ApiTags('users')
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

  @Post('personal-detail')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBody({
    description: 'Create or a update profile',
  })
  async addPersonalDetail(
    @Req() request: RequestWithUser,
    @Body() personalDetail: updateProfileDto,
  ) {
    const params = { userId: request.user.id, profileDetail: personalDetail };
    return this.usersService.updateProfile(params);
  }

  @Post('family-detail')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBody({
    description: 'Create or a update family details',
  })
  async addFamilyDetail(
    @Req() request: RequestWithUser,
    @Body() familyDetail: UpdateFamilyDto,
  ) {
    console.log('yeah we reached here');
    const params = { userId: request.user.id, familyDetail: familyDetail };
    return this.usersService.updateFamily(params);
  }

  @Post('education-detail')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBody({
    description: 'Create or a update family details',
  })
  async addEducation(
    @Req() request: RequestWithUser,
    @Body() educationDetail: UpdateEducationDto,
  ) {
    const params = { userId: request.user.id, educationDetail };
    return this.usersService.updateEducation(params);
  }

  @Post('preferance-detail')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBody({
    description: 'Create or a update family details',
  })
  async addPreferance(
    @Req() request: RequestWithUser,
    @Body() preferanceDetail: UpdatePrefDto,
  ) {
    const params = { userId: request.user.id, preferanceDetail };
    return this.usersService.updatePreferance(params);
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

  // @Delete('delete')
  // @UseGuards(JwtAuthenticationGuard)
  // async deleteUser(
  //   @Req(): request: RequestWithUser
  // ) {

  // }

  @Get('search/conversation')
  @UseGuards(JwtAuthenticationGuard)
  async searchConversation(
    @Req() request: RequestWithUser,
    @Query('username') username: string,
  ) {
    console.log('seearch/conversation');
    const result = await this.usersService.findByUserName(username);
    return result;
  }

  @Get('search')
  async searchUser(
    @Req() request: RequestWithUser,
    @Query('username') username: string,
  ) {
    const result = await this.usersService.findByUserName(username);
    return result;
  }

  @Get('filter')
  async filterUser(
    @Req() request: RequestWithUser,
    @Query('minHeight') minHeight: string,
    @Query('maxHeight') maxHeight: string,
    @Query('minAge') minAge: string,
    @Query('maxAge') maxAge: string,
    @Query('maritalStatus') maritalStatus: string,
    @Query('religion') religion: string,
    @Query('caste') caste: string,
    @Query('annualIncome') annualIncome: string,
  ) {
    console.log('we are here');
    const result = await this.usersService.filterUser({
      minHeight,
      maxHeight,
      minAge,
      maxAge,
      maritalStatus,
      religion,
      caste,
      annualIncome,
    });
    return result;
  }

  @Get('recommed/user')
  @UseGuards(JwtAuthenticationGuard)
  async recommendUsers(@Req() request: RequestWithUser) {
    const result = await this.usersService.getRecommendation(request.user);
    return result;
  }
}
