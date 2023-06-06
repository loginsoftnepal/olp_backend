import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import CreateEducationDto from './dto/createEducation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import EducationEntity from './education.entity';
import { Repository } from 'typeorm';
import UpdateEducationDto from './dto/updateEducation.dto';
import User from 'src/users/user.entity';
import { compareSync } from 'bcrypt';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
  ) {}

  async createEducationDetail(user: User, educationDetail: UpdateEducationDto) {
    const newEducationDetail = this.educationRepository.create({
      ...educationDetail,
      user: { id: user.id },
    });

    if (!newEducationDetail) {
      throw new HttpException(
        'Failed to create education detail',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.educationRepository.save(newEducationDetail);

    return newEducationDetail;
  }

  async updateEducationDetail(user: User, educationDetail: UpdateEducationDto) {
    const targetEducationDetail = await this.educationRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!targetEducationDetail) {
      throw new HttpException(
        'Education detail not found',
        HttpStatus.NOT_FOUND,
      );
    }

    console.log(educationDetail);
    await this.educationRepository.update(
      targetEducationDetail.id,
      educationDetail,
    );
    const updatedEducationDetail = await this.educationRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!updatedEducationDetail) {
      throw new HttpException(
        'Education Detail not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedEducationDetail;
  }

  async getEducationDetail(user: User) {
    const educationDetail = await this.educationRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!educationDetail) {
      throw new HttpException('Family detail not found', HttpStatus.NOT_FOUND);
    }
    return educationDetail;
  }

  async deleteEducationDetail(educationId: string) {
    const deleteResponse = await this.educationRepository.delete(educationId);
    if (!deleteResponse.affected) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
