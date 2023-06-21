import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
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
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConnectionService } from 'src/connection/connection.service';
import { ConnectionRequestsService } from 'src/connection-requests/connection-requests.service';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly connectionService: ConnectionService, // private readonly connectionRequestService: ConnectionRequestsService,
  ) {}

  @Put()
  @UseGuards(JwtAuthenticationGuard)
  async updateUser(
    @Body() newUserDetail: UpdateUserDto,
    @Req() request: RequestWithUser,
  ) {
    return this.usersService.updateUser(request.user.id, newUserDetail);
  }

  @Get('filter')
  @UseGuards(JwtAuthenticationGuard)
  async filterUser(
    @Req() request: RequestWithUser,
    @Query('minHeight') minHeight?: string,
    @Query('maxHeight') maxHeight?: string,
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
    @Query('maritalStatus') maritalStatus?: string,
    @Query('religion') religion?: string,
    @Query('caste') caste?: string,
    @Query('annualIncome') annualIncome?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
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
      page,
      limit,
    });

    return Promise.all(
      result.map(async (user) => {
        return {
          id: user.id,
          fullname: user.profile.fullname,
          year: user.profile.year,
          month: user.profile.month,
          day: user.profile.day,
          address: user.profile.address,
          caste: user.profile.caste,
          religion: user.profile.religion,
          avatarId: user.avatarId,
          occupation: user.education.occupation,
          isConnected: (await this.connectionService.isConnection(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
          // isPending: await this.connectionRequestService.isPending(
          //   request.user.id,
          //   user.id,
          // ),
        };
      }),
    );
  }

  @Get('letsBegin')
  @UseGuards(JwtAuthenticationGuard)
  async searchFromHome(
    @Req() request: RequestWithUser,
    @Query('searching_for') searchingFor: string,
    @Query('ageFrom') ageFrom: string,
    @Query('ageTo') ageTo: string,
    @Query('caste') caste: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    console.log('we are herre');
    const result = await this.usersService.letsBegin(
      searchingFor,
      ageFrom,
      ageTo,
      caste,
      request.user,
      page,
      limit,
    );

    return Promise.all(
      result.map(async (user) => {
        return {
          id: user.id,
          fullname: user.profile.fullname,
          year: user.profile.year,
          month: user.profile.month,
          day: user.profile.day,
          address: user.profile.address,
          religion: user.profile.religion,
          avatarId: user.avatarId,
          occupation: user.education.occupation,
          isConnected: (await this.connectionService.isConnection(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
          // isPending: await this.connectionRequestService.isPending(
          //   request.user.id,
          //   user.id,
          // ),
        };
      }),
    );
  }

  @Get('search')
  @UseGuards(JwtAuthenticationGuard)
  async searchUser(
    @Req() request: RequestWithUser,
    @Query('username') username: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    console.log(username);
    const result = await this.usersService.findByUserName(
      username,
      page,
      limit,
    );
    return Promise.all(
      result.map(async (user) => {
        return {
          id: user.id,
          fullname: user.profile.fullname,
          year: user.profile.year,
          month: user.profile.month,
          day: user.profile.day,
          address: user.profile.address,
          caste: user.profile.caste,
          religion: user.profile.religion,
          avatarId: user.avatarId,
          occupation: user.education.occupation,
          isConnected: (await this.connectionService.isConnection(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
          // isPending: await this.connectionRequestService.isPending(
          //   request.user.id,
          //   user.id,
          // ),
        };
      }),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  async getUserById(@Param('id') id: string) {
    console.log('getting User by Id');
    return this.usersService.getById(id);
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

  @Post('banner')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(
    FileInterceptor('banner', {
      storage: diskStorage({
        destination: './uploadedFiles/banner',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = extname(file.originalname);
          cb(null, `${uniqueSuffix}${fileExtension}`);
        },
      }),
    }),
  )
  @ApiConsumes('mulitpart/form-data')
  @ApiBody({
    description: 'A banner for user profile',
    type: FileUploadDto,
  })
  async addBanner(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addBanner(request.user.id, file);
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
    if (!user) {
      throw new HttpException('Invalid', HttpStatus.NOT_FOUND);
    }
    if (user && user.isGoogleAuth) {
      throw new HttpException('Invalid', HttpStatus.NOT_FOUND);
    }

    await this.usersService.forgetPassword(user);
  }

  @Put('password/change')
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.usersService.changePassword(
      request.user.id,
      changePassword.oldPassword,
      changePassword.newPassword,
      changePassword.confirmPassword,
    );
  }

  @Post('password/reset/:token')
  async resetPassword(
    @Body() reset: ResetPasswordDto,
    @Param('token') token: string,
  ) {
    return await this.usersService.resetPassword(reset, token);
  }

  @Delete('delete')
  @UseGuards(JwtAuthenticationGuard)
  async deleteUser(@Req() request: RequestWithUser) {
    return this.usersService.deleteUser(request.user.id);
  }

  @Get('search/conversation')
  @UseGuards(JwtAuthenticationGuard)
  async searchConversation(
    @Req() request: RequestWithUser,
    @Query('username') username: string,
  ) {
    console.log('seearch/conversation');
    const result = await this.usersService.findByUserName(username, 0, 20);
    return result;
  }

  @Get('research/:username')
  @UseGuards(JwtAuthenticationGuard)
  async researchUser(
    @Req() request: RequestWithUser,
    @Param('username') username: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    console.log(username);
    const result = await this.usersService.findByUserName(
      username,
      page,
      limit,
    );
    return Promise.all(
      result.map(async (user) => {
        return {
          id: user.id,
          fullname: user.profile.fullname,
          year: user.profile.year,
          month: user.profile.month,
          day: user.profile.day,
          address: user.profile.address,
          caste: user.profile.caste,
          religion: user.profile.religion,
          avatarId: user.avatarId,
          occupation: user.education.occupation,
          isConnected: (await this.connectionService.isConnection(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
          // isPending: await this.connectionRequestService.isPending(
          //   request.user.id,
          //   user.id,
          // ),
        };
      }),
    );
  }

  @Get('recommend/user')
  @UseGuards(JwtAuthenticationGuard)
  async recommendUsers(@Req() request: RequestWithUser) {
    const result = await this.usersService.getRecommendation(request.user);
    const resultToResult = result.map(async (user) => {
      return {
        id: user.id,
        fullname: user.profile.fullname,
        year: user.profile.year,
        month: user.profile.month,
        day: user.profile.day,
        address: user.profile.address,
        caste: user.profile.caste,
        religion: user.profile.religion,
        avatarId: user.avatarId,
        occupation: user.education.occupation,
        isConnected: (await this.connectionService.isConnection(
          request.user.id,
          user.id,
        ))
          ? true
          : false,
        // isPending: await this.connectionRequestService.isPending(
        //   request.user.id,
        //   user.id,
        // ),
      };
    });
    return Promise.all(resultToResult);
  }
}
