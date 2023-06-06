import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Profile from './profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/createProfile.dto';
import { updateProfileDto } from './dto/updateProfile.dto';
import User from 'src/users/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async createProfile(user: User, profileDetail: updateProfileDto) {
    const newProfile = this.profileRepository.create({
      ...profileDetail,
      user: user,
    });

    if (!newProfile) {
      throw new HttpException('Failed to create profile', HttpStatus.NOT_FOUND);
    }

    await this.profileRepository.save(newProfile);

    return newProfile;
  }

  async updateProfile(user: User, profileDetail: updateProfileDto) {
    const targetProfile = await this.profileRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!targetProfile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    await this.profileRepository.update(targetProfile.id, profileDetail);
    const updateProfile = await this.profileRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!updateProfile) {
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
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return profile;
  }
}
