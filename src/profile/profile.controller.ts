import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/createProfile.dto';
import { Request } from 'express';
import { updateProfileDto } from './dto/updateProfile.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';

@Controller('profile')
@UseGuards(JwtAuthenticationGuard)
@ApiTags('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async createUserProfile(
    @Body() profileDetail: CreateProfileDto,
    @Req() request: RequestWithUser,
  ) {
    // return this.profileService.createProfile(request.user, profileDetail);
  }

  @Put()
  async updateUserProfile(
    @Body() profileDetail: updateProfileDto,
    @Req() request: RequestWithUser,
  ) {
    console.log(request.user, profileDetail);
    return this.profileService.updateProfile(request.user, profileDetail);
  }

  @Get()
  async getAProfile(@Req() request: RequestWithUser) {
    return this.profileService.getAProfile(request.user.id);
  }
}
