import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/createProfile.dto';
import { Request } from 'express';
import { updateProfileDto } from './dto/updateProfile.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async createUserProfile(
    @Body() profileDetail: CreateProfileDto,
    @Req() request: RequestWithUser,
  ) {
    return this.profileService.createProfile(request.user.id, profileDetail);
  }

  @Put()
  async updateUserProfile(
    @Body() profileDetail: updateProfileDto,
    @Req() request: RequestWithUser,
  ) {
    return this.profileService.updateProfile(request.user.id, profileDetail);
  }

  @Get()
  async getAProfile(@Req() request: RequestWithUser) {
    return this.profileService.getAProfile(request.user.id);
  }
}
