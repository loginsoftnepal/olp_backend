import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Profile from './profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/createProfile.dto';
import { updateProfileDto } from './dto/updateProfile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async createProfile(userId: string, profileDetail: CreateProfileDto) {
    const newProfile = this.profileRepository.create({
      ...profileDetail,
      userId: userId,
    });

    if (!newProfile) {
      throw new HttpException('Failed to create profile', HttpStatus.NOT_FOUND);
    }

    return newProfile;
  }

  async updateProfile(userId: string, profileDetail: updateProfileDto) {
    const targetProfile = await this.profileRepository.findOne({
      where: { userId: userId },
    });

    if (!targetProfile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    await this.profileRepository.update(targetProfile.id, profileDetail);
    const updateProfile = await this.profileRepository.findOne({
      where: { userId: userId },
    });

    if (updateProfile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return updateProfile;
  }

  async deleteProfile(profleId: number) {
    const deleteResponse = await this.profileRepository.delete(profleId);
    if (!deleteResponse.affected) {
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAProfile(userId: string) {
    const profile = await this.profileRepository.findOne({
      where: { userId: userId },
    });
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return profile;
  }
}
